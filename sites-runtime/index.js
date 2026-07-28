export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let pathname = url.pathname;
    if (pathname.endsWith("/")) pathname += "index.html";
    const assetUrl = new URL(pathname, url);
    let response = await env.ASSETS.fetch(new Request(assetUrl, request));
    if (response.status === 404 && !pathname.includes(".")) {
      assetUrl.pathname = "/index.html";
      response = await env.ASSETS.fetch(new Request(assetUrl, request));
    }
    return response;
  }
};
