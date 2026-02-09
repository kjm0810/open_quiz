import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import db from "@/utils/db";

function generateRandomName(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ profile }: any) {
      const kakaoId = profile.id;

      const [rows]: any = await db.query(
        "SELECT user_id FROM quiz_user WHERE kakao_id = ?",
        [kakaoId]
      );

      // 🔹 없으면 회원가입
      if (rows.length === 0) {
        const randomName = generateRandomName();

        await db.query(
          "INSERT INTO quiz_user (kakao_id, name) VALUES (?, ?)",
          [kakaoId, randomName]
        );
      }

      return true;
    },

    async jwt({ token, profile }: any) {
      if (profile) {
        token.kakaoId = profile.id;
      }
      return token;
    },

    async session({ session, token }: any) {
      const [rows]: any = await db.query(
        "SELECT user_id, name FROM quiz_user WHERE kakao_id = ?",
        [token.kakaoId]
      );

      session.user.user_id = rows[0]?.user_id;
      session.user.name = rows[0]?.name;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
