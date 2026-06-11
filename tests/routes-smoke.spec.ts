import { expect, test, type Page } from "@playwright/test";

const SEEDED_DOB = "1990-01-01T00:00:00.000Z";
const SEEDED_TIME = "08:30";

type RouteSmoke = {
  path: string;
  assertReady: (page: Page) => Promise<void>;
};

const seedBirthDate = async (page: Page) => {
  await page.addInitScript(
    ([dob, time]) => {
      window.localStorage.setItem("dob", dob);
      window.localStorage.setItem("dobTime", time);
    },
    [SEEDED_DOB, SEEDED_TIME],
  );
};

const expectStableLayout = async (page: Page) => {
  const issues = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const scrollWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const overflowBy = scrollWidth - viewportWidth;
    const selectors = [
      "button",
      "a",
      "h1",
      "h2",
      "h3",
      "p",
      "label",
      "[role='tab']",
      "[role='button']",
    ].join(",");

    const isVisible = (element: Element) => {
      if (typeof element.checkVisibility === "function") {
        return element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true });
      }
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity) > 0.01 &&
        rect.width > 0 &&
        rect.height > 0;
    };

    const elementName = (element: Element) => {
      const id = element.id ? `#${element.id}` : "";
      const className = typeof element.className === "string" && element.className.trim()
        ? `.${element.className.trim().replace(/\s+/g, ".")}`
        : "";
      return `${element.tagName.toLowerCase()}${id}${className}`;
    };

    const textIssues = Array.from(document.querySelectorAll(selectors))
      .filter(element => element.textContent?.trim())
      .filter(isVisible)
      .flatMap(element => {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const currentIssues: string[] = [];

        if (rect.left < -2 || rect.right > viewportWidth + 2) {
          currentIssues.push(`${elementName(element)} escapes viewport horizontally`);
        }

        if (
          element instanceof HTMLElement &&
          style.overflow !== "visible" &&
          (element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
        ) {
          currentIssues.push(`${elementName(element)} clips its text`);
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const centerIsInViewport =
          centerX >= 0 &&
          centerX <= viewportWidth &&
          centerY >= 0 &&
          centerY <= window.innerHeight;

        if (centerIsInViewport) {
          const topElement = document.elementFromPoint(centerX, centerY);
          if (
            topElement &&
            topElement !== element &&
            !element.contains(topElement) &&
            !topElement.contains(element) &&
            window.getComputedStyle(topElement).pointerEvents !== "none"
          ) {
            currentIssues.push(`${elementName(element)} center is covered by ${elementName(topElement)}`);
          }
        }

        return currentIssues;
      });

    return {
      overflowBy,
      textIssues: textIssues.slice(0, 8),
    };
  });

  expect(issues.overflowBy, `horizontal overflow by ${issues.overflowBy}px`).toBeLessThanOrEqual(2);
  expect(issues.textIssues, `layout issues: ${issues.textIssues.join("; ")}`).toEqual([]);
};

const routes: RouteSmoke[] = [
  {
    path: "/",
    assertReady: async page => {
      await expect(page.getByRole("heading", { name: /kronoscope/i })).toBeVisible();
      await expect(page.getByLabel(/date of birth/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /explore/i })).toBeEnabled();
    },
  },
  {
    path: "/settings",
    assertReady: async page => {
      await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
      await expect(page.getByLabel(/date of birth/i)).toBeVisible();
      await expect(page.getByRole("button", { name: /save settings/i })).toBeEnabled();
    },
  },
  {
    path: "/milestones",
    assertReady: async page => {
      await expect(page.getByRole("heading", { name: /time map/i })).toBeVisible();
      const mobileToggle = page.getByRole("button", { name: /age perspectives/i });
      if (await mobileToggle.count()) {
        await mobileToggle.click();
      }
      await expect(page.getByRole("tablist", { name: /perspectives/i })).toBeVisible();
      await expect(page.getByRole("slider", { name: /timeline focus/i })).toBeAttached();
      await expect(page.getByRole("group", { name: /event categories/i })).toBeVisible();
    },
  },
  {
    path: "/timescales",
    assertReady: async page => {
      await expect(page.getByRole("heading", { name: /explore timescales/i })).toBeVisible();
      await expect(page.getByRole("tab", { name: /overview/i })).toBeVisible();
      await expect(page.getByRole("group", { name: /phenomenon categories/i })).toBeVisible();
    },
  },
  {
    path: "/personalize",
    assertReady: async page => {
      await expect(page).toHaveURL(/\/settings$/);
      await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
    },
  },
];

for (const route of routes) {
  test(`${route.path} renders without obvious responsive layout regressions`, async ({ page }) => {
    await seedBirthDate(page);
    await page.goto(route.path);
    await route.assertReady(page);
    await expectStableLayout(page);
  });
}

test("timeline empty state remains reachable and stable", async ({ page }) => {
  await seedBirthDate(page);
  await page.goto("/milestones");

  await expect(page.getByRole("heading", { name: /time map/i })).toBeVisible();
  await expect(page.getByRole("slider", { name: /timeline focus/i })).toBeAttached();
  await expectStableLayout(page);

  const laneGroup = page.getByRole("group", { name: /timeline lanes/i });
  await laneGroup.getByRole("button", { name: "Personal" }).click();
  await laneGroup.getByRole("button", { name: "Global" }).click();

  await expect(page.getByRole("status").filter({ hasText: /nothing to show right now/i })).toBeVisible();
  await expectStableLayout(page);
});
