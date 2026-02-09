// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";

// DB 대신 Express API 호출
async function fetchApi(url: string, method = "GET", body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

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

      const { exists } = await fetchApi(
        `${process.env.API_URL}/api/auth/check_user`,
        "POST",
        { kakaoId }
      );

      if (!exists) {
        await fetchApi(`${process.env.API_URL}/api/auth/create_user`, "POST", {
          kakaoId,
          name: generateRandomName(),
        });
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
      const user = await fetchApi(`${process.env.API_URL}/api/auth/get_user?kakaoId=${token.kakaoId}`);
      session.user.user_id = user.user_id;
      session.user.name = user.name;
      return session;
    },
  },
};

// App Router용: HTTP 메서드별 export
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; // ✅ 반드시 이렇게
