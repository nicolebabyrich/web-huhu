import { initializePage } from "../../src/app.js";
import { BlogPage, mountBlogPage } from "../../src/modules/blog/BlogPage.js";

initializePage({ render: BlogPage, mount: mountBlogPage, activePath: "blog" });
