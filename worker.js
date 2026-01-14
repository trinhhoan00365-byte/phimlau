export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* =========================
       CORS PREFLIGHT
       ========================= */
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }

    /* =========================
       FORCE DOWNLOAD
       /download?url=https://cdn.yoursite.com/file.mp4
       ========================= */
    if (url.pathname === "/download") {
      const fileUrl = url.searchParams.get("url");
      if (!fileUrl) {
        return new Response("Missing url", { status: 400 });
      }

      // 🔒 chỉ cho phép tải file qua CDN (tránh leak B2)
      if (!fileUrl.startsWith("https://")) {
        return new Response("Forbidden", { status: 403 });
      }

      const res = await fetch(fileUrl);

      return new Response(res.body, {
        headers: {
          "Content-Type":
            res.headers.get("Content-Type") || "application/octet-stream",

          // 🔥 ÉP TRÌNH DUYỆT TẢI FILE
          "Content-Disposition": "attachment",

          // 🔥 GIỮ CACHE CLOUDFLARE (KHÔNG TỐN B2)
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    /* =========================
       VIDEO SLUG
       /watch/123 -> /watch.html?id=123
       ========================= */
    const watchMatch = url.pathname.match(/^\/watch\/(\d+)$/);
    if (watchMatch) {
      url.pathname = "/watch.html";
      url.searchParams.set("id", watchMatch[1]);
      return fetch(url.toString(), request);
    }

    /* =========================
       PAGINATION
       ========================= */
    const pageMatch = url.pathname.match(/^\/page\/(\d+)\/?$/);
    if (pageMatch) {
      url.pathname = "/index.html";
      url.searchParams.set("page", pageMatch[1]);
      return fetch(url.toString(), request);
    }

    /* =========================
       API
       ========================= */
    if (url.pathname === "/videos") {
      const list = await env.VIDEOS.get("list");
      return json(list ? JSON.parse(list) : []);
    }

    if (url.pathname === "/admin/add" && request.method === "POST") {
      const { password, video } = await request.json();
      if (password !== "11111") return json({ error: "Unauthorized" }, 401);

      const list = JSON.parse(await env.VIDEOS.get("list") || "[]");
      video.id = Date.now();
      list.unshift(video);
      await env.VIDEOS.put("list", JSON.stringify(list));
      return json({ success: true });
    }

    if (url.pathname === "/admin/edit" && request.method === "POST") {
      const { password, video } = await request.json();
      if (password !== "11111") return json({ error: "Unauthorized" }, 401);

      const list = JSON.parse(await env.VIDEOS.get("list") || "[]");
      const idx = list.findIndex(v => v.id === video.id);
      if (idx === -1) return json({ error: "Not found" }, 404);

      list[idx] = { ...list[idx], ...video };
      await env.VIDEOS.put("list", JSON.stringify(list));
      return json({ success: true });
    }

    if (url.pathname === "/admin/delete" && request.method === "POST") {
      const { password, id } = await request.json();
      if (password !== "11111") return json({ error: "Unauthorized" }, 401);

      let list = JSON.parse(await env.VIDEOS.get("list") || "[]");
      list = list.filter(v => v.id !== id);
      await env.VIDEOS.put("list", JSON.stringify(list));
      return json({ success: true });
    }

    if (url.pathname === "/view") {
      const id = url.searchParams.get("id");
      const inc = url.searchParams.get("inc");
      const key = "view:" + id;
      let views = Number(await env.VIEWS.get(key) || 0);

      if (inc === "1") {
        views++;
        await env.VIEWS.put(key, views.toString());
      }
      return json({ views });
    }

    /* =========================
       PASS THROUGH FILE TĨNH
       ========================= */
    return fetch(request);
  }
};

/* =========================
   HELPERS
   ========================= */
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors(),
      "Content-Type": "application/json"
    }
  });
}

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
