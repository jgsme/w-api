import { Hono } from "hono";
import { client } from "./lib/getClient.ts";

const app = new Hono();
app.get("/", (c) => c.text("It works!"));
app.get("/latest_articles", async ({ req, ...c }) => {
  const url = new URL(req.url);
  const p = parseInt(url.searchParams.get("p") ?? "0");
  const { data, error } = await client.rpc("latest_articles", {
    offset_arg: p * 20,
    limit_arg: 20,
  });
  if (error) {
    console.error(error);
    c.status(500);
    return c.json({
      ok: false,
    });
  }
  return c.json({
    ok: true,
    payload: data,
  });
});
app.get("/clips", async ({ req, ...c }) => {
  const url = new URL(req.url);
  const p = parseInt(url.searchParams.get("p") ?? "0");
  const { data, error } = await client.rpc("latest_clips", {
    offset_arg: p * 20,
    limit_arg: 20,
  });
  if (error) {
    console.error(error);
    c.status(500);
    return c.json({
      ok: false,
    });
  }
  return c.json({
    ok: true,
    payload: data,
  });
});
app.get("/recent_articles", async (c) => {
  const { data, error } = await client.rpc("recent_articles");
  if (error) {
    console.error(error);
    c.status(500);
    return c.json({
      ok: false,
    });
  }
  return c.json({
    ok: true,
    payload: data,
  });
});
app.get("/recent_clips", async (c) => {
  const { data, error } = await client.rpc("recent_clips");
  if (error) {
    console.error(error);
    c.status(500);
    return c.json({
      ok: false,
    });
  }
  return c.json({
    ok: true,
    payload: data,
  });
});
app.get("/search", async ({ req, ...c }) => {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const p = parseInt(url.searchParams.get("p") ?? "0");
  if (q) {
    const { data, error } = await client.rpc("search_title", {
      q_arg: `%${decodeURIComponent(q)}%`,
      offset_arg: p * 100,
      limit_arg: 100,
    });
    if (error) {
      console.error(error);
      c.status(500);
      return c.json({
        ok: false,
      });
    }
    return c.json({
      ok: true,
      payload: data,
    });
  }
  return c.json({
    ok: false,
  });
});
app.get('/title_to_id', async ({ req, ...c }) => {
  const url = new URL(req.url);
  const title = url.searchParams.get('title');
  if (title) {
    const { data, error } = await client.rpc('title_to_id', {
      title_arg: title
    });
    if (error) {
      console.error(error);
      c.status(500);
      return c.json({
        ok: false
      });
    }
    return c.json({
      ok: true,
      payload: data
    });
  }
  return c.json({
    ok: false
  });
});
app.get('/id_to_title', async ({ req, ...c }) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (id) {
    const { data, error } = await client.rpc('id_to_title', {
      id_arg: parseInt(id)
    });
    if (error) {
      console.error(error);
      c.status(500);
      return c.json({
        ok: false
      });
    }
    return c.json({
      ok: true,
      payload: data
    });
  }
  return c.json({
    ok: false
  });
});

Deno.serve(app.fetch);
