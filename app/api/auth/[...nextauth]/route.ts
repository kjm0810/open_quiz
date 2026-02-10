// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import db from "@/utils/db";

function generateRandomName(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile }: any) {
      const kakaoId = profile.id;

      // 사용자 존재 여부 확인
      const existing = await db.query(
        "SELECT user_id FROM users WHERE kakao_id = $1",
        [kakaoId]
      );

      if (!existing || existing.length === 0) {
        const name = generateRandomName();
        await db.query(
          "INSERT INTO users (kakao_id, name) VALUES ($1, $2)",
          [kakaoId, name]
        );
      }

      return true;
    },

    async jwt({ token, profile }: any) {
      if (profile) token.kakaoId = profile.id;
      return token;
    },

    async session({ session, token }: any) {
      if (!token.kakaoId) {
        console.warn("token.kakaoId is missing");
        return session;
      }

      const users = await db.query(
        "SELECT user_id, name FROM users WHERE kakao_id = $1",
        [token.kakaoId]
      );
      const user = users[0];

      if (user) {
        session.user.user_id = user.user_id;
        session.user.name = user.name;
      }

      return session;
    },
  },
};

// App Router용: HTTP 메서드별 export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // ✅ 반드시 이렇게
