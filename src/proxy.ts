// Keeps the panel session fresh and sends signed-out visitors of /yonetim to the sign-in page. This is only the
// optimistic check: every panel page and action verifies the user and the admin_users row again on the server.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/public-env";
import { ADMIN_LOGIN_PATH } from "@/components/sites/teknosem/site-config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) return response;

  const supabase = createServerClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list, headers) => {
        for (const { name, value } of list) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const onLogin = request.nextUrl.pathname === ADMIN_LOGIN_PATH;
  if (!data?.claims && !onLogin) {
    const url = request.nextUrl.clone();
    url.pathname = ADMIN_LOGIN_PATH;
    url.search = "";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/yonetim", "/yonetim/:path*"],
};
