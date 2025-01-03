"use server";

import { parse } from "node-html-parser";

export async function analyzeHtml(formData: FormData) {
  const url = formData.get("url") as string;

  try {
    // Validate URL
    new URL(url);

    // Fetch HTML content
    const response = await fetch(url);
    const html = await response.text();

    // Parse HTML using node-html-parser
    const root = parse(html);

    // Find elements with 'cp' class
    const cpElements = root.querySelectorAll(".cp");

    // Find elements with 'data-scroll' attribute
    const dataScrollElements = root.querySelectorAll("[data-scroll]");

    // Find img elements with empty alt attributes
    const imgElements = root.querySelectorAll("img");
    const emptyAltImgs = imgElements.filter((img) => {
      const alt = img.getAttribute("alt");
      // Fix: Handle undefined alt attribute
      return alt === null || alt === undefined || alt.trim() === "";
    });

    // Find elements with 'cdp_grid' class
    const cdpGridElements = root.querySelectorAll(".cdp_grid");

    // Find elements with 'brandpage' class
    const brandpageElements = root.querySelectorAll(".brandpage");

    // Extract relevant information
    const cpResults = cpElements.map((element) => ({
      tag: element.tagName.toLowerCase(),
      classes: element.classList?.value || "",
      id: element.id || undefined,
    }));

    const scrollResults = dataScrollElements.map((element) => ({
      tag: element.tagName.toLowerCase(),
      classes: element.classList?.value || "",
      id: element.id || undefined,
      dataScroll: element.getAttribute("data-scroll"),
    }));

    const imgResults = emptyAltImgs.map((element) => ({
      tag: "img",
      src: element.getAttribute("src") || "",
      classes: element.classList?.value || "",
      id: element.id || undefined,
    }));

    const cdpGridResults = cdpGridElements.map((element) => ({
      tag: element.tagName.toLowerCase(),
      classes: element.classList?.value || "",
      id: element.id || undefined,
    }));

    const brandpageResults = brandpageElements.map((element) => ({
      tag: element.tagName.toLowerCase(),
      classes: element.classList?.value || "",
      id: element.id || undefined,
    }));

    return {
      success: true,
      cpElements: cpResults,
      dataScrollElements: scrollResults,
      emptyAltImgs: imgResults,
      cdpGridElements: cdpGridResults,
      brandpageElements: brandpageResults,
    };
  } catch (error) {
    console.error("Error analyzing HTML:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while analyzing the HTML",
    };
  }
}
