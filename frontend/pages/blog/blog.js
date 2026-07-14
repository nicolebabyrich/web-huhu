import { initializePage } from "../../src/app.js?v=20260714-textfix2";
import { BlogPage, mountBlogPage } from "../../src/modules/blog/BlogPage.js";

initializePage({ render: BlogPage, mount: mountBlogPage, activePath: "blog" });
