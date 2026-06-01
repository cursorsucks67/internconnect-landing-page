# Spark Sharing Deep Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build public `https://spark.internconnected.co/sparks/:sparkId` and `https://spark.internconnected.co/posts/:postId` links that open Spark when installed and fall back to TestFlight/download in the browser.

**Architecture:** Use the existing Next 15 landing-page project as the tiny universal-link host for `spark.internconnected.co`, with static verification files and fallback pages. Update the Expo app to use the same canonical host, parse pending content links in `AppRoot`, and consume them in `SignedInApp` after auth/onboarding.

**Tech Stack:** Next.js App Router, Vercel, Expo React Native, `expo-linking`, `@react-native-async-storage/async-storage`, React Native `Share`, Vitest/TypeScript.

---

## File Structure

Website repo: `/Users/qihongwu/VSCode/internconnect-landing-page`

- Modify: `next.config.mjs`
  - Add redirects/headers only if needed after route implementation. Prefer App Router route files for verification endpoints so content type is explicit.
- Create: `app/.well-known/apple-app-site-association/route.ts`
  - Serve the Apple App Site Association JSON with no redirect and an `application/json` content type.
- Create: `app/download/route.ts`
  - Redirect to the real TestFlight public link from `SPARK_TESTFLIGHT_URL`.
- Create: `app/sparks/[sparkId]/page.tsx`
  - Browser fallback page for Spark links.
- Create: `app/posts/[postId]/page.tsx`
  - Browser fallback page for post links.
- Create: `components/DeepLinkFallbackPage.tsx`
  - Shared fallback UI for `/sparks/:sparkId` and `/posts/:postId`.
- Create: `app/invite/[code]/page.tsx`
  - Optional compatibility fallback for invite links if `spark.internconnected.co/invite/:code` becomes canonical for invites too.

App repo: `/Users/qihongwu/VSCode/networking-app`

- Modify: `app.json`
  - Use only `spark.internconnected.co` in iOS associated domains.
- Modify: `src/features/referrals/contextualInvite.ts`
  - Change the default public base URL and export Spark/post share URL builders.
- Create: `src/features/sharing/shareLinks.test.ts`
  - Test public share URL generation and URL encoding.
- Create: `src/app/contentDeepLinks.ts`
  - Keep pending content route type, storage key, URL parser, and serialization helpers out of `AppRoot`.
- Create: `src/app/contentDeepLinks.test.ts`
  - Test parsing for universal links, custom-scheme links, encoded IDs, unrelated URLs, and storage serialization.
- Modify: `src/app/AppRoot.tsx`
  - Persist pending Spark/post links and pass them to `SignedInApp` once the signed-in app is ready.
- Modify: `src/app/SignedInApp.tsx`
  - Accept and consume `initialContentRoute`; open Spark details directly and fetch board posts by ID.
- Modify: `src/app/SignedInApp.test.ts`
  - Cover initial Spark/post route consumption without relying on a real database.
- Modify Spark and post detail/share surfaces after locating the exact components
  - Add `Share.share()` actions using `buildSparkShareUrl()` and `buildPostShareUrl()`.

## Required External Values

- Apple Developer Team ID for production app ID `TEAM_ID.com.sparknyc.app`.
- Optional dev/TestFlight bundle ID app ID `TEAM_ID.com.qihongw08.spark.dev`, only if those builds should open links.
- Public TestFlight URL for `SPARK_TESTFLIGHT_URL`.
- Vercel domain setup: add `spark.internconnected.co` to this project, then point DNS CNAME/ALIAS to Vercel as instructed by the Vercel domain screen.

### Task 1: Add Website Verification Endpoints

**Files:**
- Create: `/Users/qihongwu/VSCode/internconnect-landing-page/app/.well-known/apple-app-site-association/route.ts`

- [ ] **Step 1: Create Apple association route**

```ts
import { NextResponse } from "next/server";

const appleAppSiteAssociation = {
  applinks: {
    apps: [],
    details: [
      {
        appIDs: [
          `${process.env.APPLE_TEAM_ID}.com.sparknyc.app`,
          ...(process.env.APPLE_DEV_BUNDLE_ID
            ? [`${process.env.APPLE_TEAM_ID}.${process.env.APPLE_DEV_BUNDLE_ID}`]
            : []),
        ],
        paths: ["/invite/*", "/sparks/*", "/posts/*"],
      },
    ],
  },
};

export function GET() {
  return NextResponse.json(appleAppSiteAssociation, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "application/json",
    },
  });
}
```

- [ ] **Step 2: Run the website build**

Run:

```bash
npm run build
```

Expected: `next build` succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/.well-known/apple-app-site-association/route.ts
git commit -m "feat: add app link verification endpoints"
```

### Task 2: Add Website Download and Fallback Pages

**Files:**
- Create: `/Users/qihongwu/VSCode/internconnect-landing-page/app/download/route.ts`
- Create: `/Users/qihongwu/VSCode/internconnect-landing-page/components/DeepLinkFallbackPage.tsx`
- Create: `/Users/qihongwu/VSCode/internconnect-landing-page/app/sparks/[sparkId]/page.tsx`
- Create: `/Users/qihongwu/VSCode/internconnect-landing-page/app/posts/[postId]/page.tsx`
- Optional create: `/Users/qihongwu/VSCode/internconnect-landing-page/app/invite/[code]/page.tsx`

- [ ] **Step 1: Create `/download` redirect**

```ts
import { redirect } from "next/navigation";

export function GET() {
  redirect(process.env.SPARK_TESTFLIGHT_URL ?? "https://testflight.apple.com/join/REPLACE_ME");
}
```

- [ ] **Step 2: Create shared fallback component**

```tsx
import Link from "next/link";

type DeepLinkFallbackPageProps = {
  kind: "spark" | "post" | "invite";
  id: string;
};

export function DeepLinkFallbackPage({ kind, id }: DeepLinkFallbackPageProps) {
  const label = kind === "spark" ? "Spark" : kind === "post" ? "post" : "invite";
  const nativeUrl =
    kind === "spark"
      ? `spark://sparks/${encodeURIComponent(id)}`
      : kind === "post"
        ? `spark://posts/${encodeURIComponent(id)}`
        : `spark://invite/${encodeURIComponent(id)}`;

  return (
    <main className="deep-link-page">
      <section className="deep-link-shell">
        <p className="deep-link-eyebrow">Spark</p>
        <h1>Open this {label} in Spark</h1>
        <p>
          If Spark is installed, open the app. If not, download the TestFlight build and this link can be opened after
          setup.
        </p>
        <div className="deep-link-actions">
          <a className="primary-link" href={nativeUrl}>
            Open Spark
          </a>
          <Link className="secondary-link" href="/download">
            Download Spark
          </Link>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Create Spark fallback page**

```tsx
import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";

export default async function SparkFallbackPage({
  params,
}: {
  params: Promise<{ sparkId: string }>;
}) {
  const { sparkId } = await params;
  return <DeepLinkFallbackPage kind="spark" id={sparkId} />;
}
```

- [ ] **Step 4: Create post fallback page**

```tsx
import { DeepLinkFallbackPage } from "../../../components/DeepLinkFallbackPage";

export default async function PostFallbackPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <DeepLinkFallbackPage kind="post" id={postId} />;
}
```

- [ ] **Step 5: Add fallback page CSS to `styles.css`**

```css
.deep-link-page {
  align-items: center;
  background: #f8f4e8;
  color: #071422;
  display: flex;
  min-height: 100vh;
  padding: 24px;
}

.deep-link-shell {
  margin: 0 auto;
  max-width: 520px;
}

.deep-link-eyebrow {
  color: #13795b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  margin: 0 0 12px;
  text-transform: uppercase;
}

.deep-link-shell h1 {
  font-size: 36px;
  line-height: 1.05;
  margin: 0 0 16px;
}

.deep-link-shell p {
  color: #425466;
  font-size: 17px;
  line-height: 1.5;
  margin: 0;
}

.deep-link-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.primary-link,
.secondary-link {
  align-items: center;
  border-radius: 6px;
  display: inline-flex;
  font-weight: 800;
  justify-content: center;
  min-height: 48px;
  padding: 0 18px;
  text-decoration: none;
}

.primary-link {
  background: #13795b;
  color: #ffffff;
}

.secondary-link {
  color: #13795b;
}
```

- [ ] **Step 6: Run the website build**

Run:

```bash
npm run build
```

Expected: `next build` succeeds and lists `/download`, `/sparks/[sparkId]`, and `/posts/[postId]`.

- [ ] **Step 7: Commit**

```bash
git add app/download/route.ts components/DeepLinkFallbackPage.tsx app/sparks app/posts styles.css
git commit -m "feat: add deep link fallback pages"
```

### Task 3: Configure Domain and Environment in Vercel

**Files:**
- No code files. Vercel project settings and DNS only.

- [ ] **Step 1: Add Vercel environment variables**

Set production env vars:

```text
APPLE_TEAM_ID=<real Apple Developer Team ID>
APPLE_DEV_BUNDLE_ID=com.qihongw08.spark.dev
SPARK_TESTFLIGHT_URL=<public TestFlight URL>
```

Expected: values are visible in Vercel project settings for Production.

- [ ] **Step 2: Add domain**

Add `spark.internconnected.co` to the same Vercel project that deploys `/Users/qihongwu/VSCode/internconnect-landing-page`.

Expected: Vercel provides DNS instructions.

- [ ] **Step 3: Update DNS**

Create the DNS record Vercel requests for `spark.internconnected.co`.

Expected: Vercel marks the domain as valid and issued with HTTPS.

- [ ] **Step 4: Verify live endpoints**

Run:

```bash
curl -i https://spark.internconnected.co/.well-known/apple-app-site-association
curl -I https://spark.internconnected.co/download
curl -I https://spark.internconnected.co/sparks/example-spark-id
curl -I https://spark.internconnected.co/posts/example-post-id
```

Expected: AASA returns `200`; `/download` redirects to TestFlight; fallback pages return `200`; no `.well-known/apple-app-site-association` redirect occurs.

### Task 4: Update Native App Link Configuration

**Files:**
- Modify: `/Users/qihongwu/VSCode/networking-app/app.json`
- Test: `/Users/qihongwu/VSCode/networking-app/app.config.test.js`

- [ ] **Step 1: Update iOS associated domains**

Use only the owned canonical host:

```json
"associatedDomains": [
  "applinks:spark.internconnected.co"
]
```

- [ ] **Step 2: Update config tests**

Add assertions in `app.config.test.js` that `spark.internconnected.co` exists in `associatedDomains` and no Android intent filters are required.

- [ ] **Step 3: Run config tests**

Run:

```bash
bun test app.config.test.js
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app.json app.config.test.js
git commit -m "feat: configure spark app links domain"
```

### Task 5: Add Share URL Helpers

**Files:**
- Modify: `/Users/qihongwu/VSCode/networking-app/src/features/referrals/contextualInvite.ts`
- Create: `/Users/qihongwu/VSCode/networking-app/src/features/sharing/shareLinks.test.ts`

- [ ] **Step 1: Add failing URL helper tests**

```ts
import { describe, expect, it, vi } from "vitest";

describe("public share links", () => {
  it("builds Spark share links on the canonical domain", async () => {
    vi.stubEnv("EXPO_PUBLIC_INVITE_BASE_URL", "");
    const links = await import("../referrals/contextualInvite");
    expect(links.buildSparkShareUrl("spark 1")).toBe("https://spark.internconnected.co/sparks/spark%201");
  });

  it("builds post share links on the canonical domain", async () => {
    vi.stubEnv("EXPO_PUBLIC_INVITE_BASE_URL", "");
    const links = await import("../referrals/contextualInvite");
    expect(links.buildPostShareUrl("post/1")).toBe("https://spark.internconnected.co/posts/post%2F1");
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
bun test src/features/sharing/shareLinks.test.ts
```

Expected: FAIL because `buildSparkShareUrl` and `buildPostShareUrl` do not exist.

- [ ] **Step 3: Implement helpers**

```ts
export function getInviteBaseUrl() {
  return cleanEnvValue(process.env.EXPO_PUBLIC_INVITE_BASE_URL) || "https://spark.internconnected.co";
}

export function buildSparkShareUrl(sparkId: string) {
  return `${getInviteBaseUrl()}/sparks/${encodeURIComponent(sparkId)}`;
}

export function buildPostShareUrl(postId: string) {
  return `${getInviteBaseUrl()}/posts/${encodeURIComponent(postId)}`;
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
bun test src/features/sharing/shareLinks.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/referrals/contextualInvite.ts src/features/sharing/shareLinks.test.ts
git commit -m "feat: add public Spark share links"
```

### Task 6: Add Content Deep Link Parsing and Persistence

**Files:**
- Create: `/Users/qihongwu/VSCode/networking-app/src/app/contentDeepLinks.ts`
- Create: `/Users/qihongwu/VSCode/networking-app/src/app/contentDeepLinks.test.ts`

- [ ] **Step 1: Add failing parser tests**

```ts
import { describe, expect, it } from "vitest";
import * as Linking from "expo-linking";

import {
  getContentRouteFromUrl,
  parseStoredContentRoute,
  serializeContentRoute,
} from "./contentDeepLinks";

describe("content deep links", () => {
  it("parses universal Spark links", () => {
    expect(getContentRouteFromUrl(Linking.parse("https://spark.internconnected.co/sparks/spark-123"))).toEqual({
      name: "spark_detail",
      sparkId: "spark-123",
    });
  });

  it("parses universal post links", () => {
    expect(getContentRouteFromUrl(Linking.parse("https://spark.internconnected.co/posts/post-123"))).toEqual({
      name: "board_post",
      postId: "post-123",
    });
  });

  it("parses native scheme links", () => {
    expect(getContentRouteFromUrl(Linking.parse("spark://posts/post-123"))).toEqual({
      name: "board_post",
      postId: "post-123",
    });
  });

  it("ignores unrelated links", () => {
    expect(getContentRouteFromUrl(Linking.parse("https://spark.internconnected.co/download"))).toBeNull();
  });

  it("round-trips stored routes", () => {
    const route = { name: "spark_detail" as const, sparkId: "spark-123" };
    expect(parseStoredContentRoute(serializeContentRoute(route))).toEqual(route);
  });
});
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```bash
bun test src/app/contentDeepLinks.test.ts
```

Expected: FAIL because `contentDeepLinks.ts` does not exist.

- [ ] **Step 3: Implement parser module**

```ts
import type * as Linking from "expo-linking";

export const pendingContentRouteStorageKey = "spark.pendingContentRoute";

export type PendingContentRoute =
  | { name: "spark_detail"; sparkId: string }
  | { name: "board_post"; postId: string };

export function getContentRouteFromUrl(parsed: Linking.ParsedURL): PendingContentRoute | null {
  const parsedWithHost = parsed as Linking.ParsedURL & { hostname?: string };
  const path = [parsedWithHost.hostname, parsed.path].filter(Boolean).join("/");
  const pathParts = path.split("/").filter(Boolean).map(decodeURIComponent);

  const sparkIndex = pathParts.indexOf("sparks");
  if (sparkIndex >= 0 && pathParts[sparkIndex + 1]) {
    return { name: "spark_detail", sparkId: pathParts[sparkIndex + 1] };
  }

  const postIndex = pathParts.indexOf("posts");
  if (postIndex >= 0 && pathParts[postIndex + 1]) {
    return { name: "board_post", postId: pathParts[postIndex + 1] };
  }

  return null;
}

export function serializeContentRoute(route: PendingContentRoute) {
  return JSON.stringify(route);
}

export function parseStoredContentRoute(value: string | null): PendingContentRoute | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as Partial<PendingContentRoute>;

    if (parsed.name === "spark_detail" && typeof parsed.sparkId === "string") {
      return { name: "spark_detail", sparkId: parsed.sparkId };
    }

    if (parsed.name === "board_post" && typeof parsed.postId === "string") {
      return { name: "board_post", postId: parsed.postId };
    }
  } catch {
    return null;
  }

  return null;
}
```

- [ ] **Step 4: Run tests**

Run:

```bash
bun test src/app/contentDeepLinks.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/contentDeepLinks.ts src/app/contentDeepLinks.test.ts
git commit -m "feat: parse content deep links"
```

### Task 7: Wire Pending Content Routes Through AppRoot

**Files:**
- Modify: `/Users/qihongwu/VSCode/networking-app/src/app/AppRoot.tsx`
- Test: `/Users/qihongwu/VSCode/networking-app/src/app/AppRootPasswordRecovery.test.ts` or create `/Users/qihongwu/VSCode/networking-app/src/app/AppRootContentDeepLinks.test.ts`

- [ ] **Step 1: Import content route helpers**

```ts
import {
  getContentRouteFromUrl,
  parseStoredContentRoute,
  pendingContentRouteStorageKey,
  serializeContentRoute,
  type PendingContentRoute,
} from "src/app/contentDeepLinks";
```

- [ ] **Step 2: Add state and save helper**

```ts
const [pendingContentRoute, setPendingContentRoute] = useState<PendingContentRoute | null>(null);

async function savePendingContentRoute(route: PendingContentRoute | null) {
  setPendingContentRoute(route);

  if (route) {
    await AsyncStorage.setItem(pendingContentRouteStorageKey, serializeContentRoute(route));
  } else {
    await AsyncStorage.removeItem(pendingContentRouteStorageKey);
  }
}
```

- [ ] **Step 3: Parse content links inside `handleAuthUrl`**

```ts
const contentRoute = getContentRouteFromUrl(parsed);

if (contentRoute) {
  await savePendingContentRoute(contentRoute);
}
```

- [ ] **Step 4: Restore stored route on startup**

```ts
AsyncStorage.getItem(pendingContentRouteStorageKey).then((storedContentRoute) => {
  const route = parseStoredContentRoute(storedContentRoute);
  if (route) {
    setPendingContentRoute(route);
  }
});
```

- [ ] **Step 5: Pass route to `SignedInApp` only when ready**

```tsx
return (
  <SignedInApp
    initialContentRoute={pendingContentRoute}
    onInitialContentRouteConsumed={() => {
      void savePendingContentRoute(null);
    }}
    onProfileChanged={setProfile}
    profile={profile}
  />
);
```

- [ ] **Step 6: Run app tests**

Run:

```bash
bun test src/app/contentDeepLinks.test.ts src/app/AppRootPasswordRecovery.test.ts
```

Expected: PASS. If the existing AppRoot test mocks `SignedInApp`, update the mock to accept the new optional props.

- [ ] **Step 7: Commit**

```bash
git add src/app/AppRoot.tsx src/app/AppRootPasswordRecovery.test.ts
git commit -m "feat: persist pending content links"
```

### Task 8: Consume Content Routes in SignedInApp

**Files:**
- Modify: `/Users/qihongwu/VSCode/networking-app/src/app/SignedInApp.tsx`
- Modify: `/Users/qihongwu/VSCode/networking-app/src/app/SignedInApp.test.ts`

- [ ] **Step 1: Import route type and post fetcher**

```ts
import type { PendingContentRoute } from "src/app/contentDeepLinks";
import { getCityBoardPost } from "src/features/threads/threadService";
```

- [ ] **Step 2: Add props**

```ts
export function SignedInApp({
  initialContentRoute,
  onInitialContentRouteConsumed,
  onProfileChanged,
  profile,
}: {
  initialContentRoute?: PendingContentRoute | null;
  onInitialContentRouteConsumed?: () => void;
  onProfileChanged: (profile: UserProfile) => void;
  profile: UserProfile;
}) {
```

- [ ] **Step 3: Consume Spark and post links**

```ts
useEffect(() => {
  if (!initialContentRoute) {
    return;
  }

  if (initialContentRoute.name === "spark_detail") {
    openSparkDetail(initialContentRoute.sparkId);
    onInitialContentRouteConsumed?.();
    return;
  }

  let cancelled = false;

  async function openBoardPost(postId: string) {
    const response = await getCityBoardPost({
      threadId: postId,
      viewerUserId: profile.id,
    });

    if (cancelled) {
      return;
    }

    setTab("posts");
    setObjectRoute(null);
    setPostsScope("city");

    if (response.data) {
      setActiveBoardPost(response.data);
      setIsFullPage(true);
    } else {
      setActiveBoardPost(null);
      setIsFullPage(false);
    }

    onInitialContentRouteConsumed?.();
  }

  void openBoardPost(initialContentRoute.postId);

  return () => {
    cancelled = true;
  };
}, [initialContentRoute, onInitialContentRouteConsumed, profile.id]);
```

- [ ] **Step 4: Add tests**

Add one test that renders with `{ name: "spark_detail", sparkId: "spark-123" }` and asserts the Spark detail screen receives `spark-123`.

Add one test that mocks `getCityBoardPost` to return a `ThreadRow`, renders with `{ name: "board_post", postId: "post-123" }`, and asserts `PostsScreen` receives `activeBoardPost`.

- [ ] **Step 5: Run tests**

Run:

```bash
bun test src/app/SignedInApp.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/app/SignedInApp.tsx src/app/SignedInApp.test.ts
git commit -m "feat: open pending content deep links"
```

### Task 9: Add Share Actions in the App

**Files:**
- Locate exact files with:
  - `rg -n "Share|onShare|share|SparkDetailScreen|activeBoardPost|ThreadRow" src`
- Modify Spark detail and board post detail components.

- [ ] **Step 1: Locate share surfaces**

Run:

```bash
rg -n "Share|onShare|share|SparkDetailScreen|activeBoardPost|ThreadRow" src
```

Expected: identify the Spark detail header/actions and post detail header/actions.

- [ ] **Step 2: Add Spark share action**

Use this implementation where the Spark detail has access to `sparkId`:

```ts
import { Share } from "react-native";
import { buildSparkShareUrl } from "src/features/referrals/contextualInvite";

async function shareSpark() {
  await Share.share({
    message: `Join this Spark: ${buildSparkShareUrl(sparkId)}`,
    url: buildSparkShareUrl(sparkId),
  });
}
```

- [ ] **Step 3: Add post share action**

Use this implementation where the post detail has access to the post/thread ID:

```ts
import { Share } from "react-native";
import { buildPostShareUrl } from "src/features/referrals/contextualInvite";

async function sharePost(postId: string) {
  await Share.share({
    message: `Open this Spark post: ${buildPostShareUrl(postId)}`,
    url: buildPostShareUrl(postId),
  });
}
```

- [ ] **Step 4: Run typecheck and focused tests**

Run:

```bash
bun run typecheck
bun test src/features/sharing/shareLinks.test.ts src/app/contentDeepLinks.test.ts src/app/SignedInApp.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src
git commit -m "feat: share Spark content links"
```

### Task 10: End-to-End Verification

**Files:**
- No new code unless issues are found.

- [ ] **Step 1: Verify web host locally**

Run in `/Users/qihongwu/VSCode/internconnect-landing-page`:

```bash
npm run build
npm run start
```

Then in another shell:

```bash
curl -i http://localhost:3000/.well-known/apple-app-site-association
curl -I http://localhost:3000/download
curl -I http://localhost:3000/sparks/example-spark-id
curl -I http://localhost:3000/posts/example-post-id
```

Expected: verification endpoints and fallback pages respond correctly.

- [ ] **Step 2: Verify app typecheck and tests**

Run in `/Users/qihongwu/VSCode/networking-app`:

```bash
bun run typecheck
bun test
```

Expected: PASS.

- [ ] **Step 3: Build a new native app**

Run for iOS TestFlight:

```bash
bun run build:ios:production
```

Expected: EAS build succeeds and includes the new associated domains.

- [ ] **Step 4: Install and test link opening**

On a device with the new build installed, open:

```text
https://spark.internconnected.co/sparks/<real-spark-id>
https://spark.internconnected.co/posts/<real-post-id>
```

Expected: links open the installed app and navigate to the referenced Spark/post.

- [ ] **Step 5: Test logged-out flow**

Sign out, open a real Spark/post link, complete login/onboarding.

Expected: the app opens the intended Spark/post after the signed-in app is ready and clears the pending route.

- [ ] **Step 6: Test fallback flow**

On a device without Spark installed, open:

```text
https://spark.internconnected.co/sparks/<real-spark-id>
```

Expected: browser fallback page appears and `/download` sends the user to TestFlight.

## Self-Review

- Spec coverage: The plan covers `spark.internconnected.co` DNS/Vercel hosting, AASA, `/invite`, `/sparks`, `/posts`, `/download`, native config, share URL helpers, app URL parsing, pending route persistence, signed-in navigation, post fetch by ID, and testing.
- Placeholder scan: Remaining angle-bracket values are intentionally external secrets/IDs that must come from Apple, TestFlight, and Vercel. No code step uses undefined app functions except existing repo functions verified in the handoff or earlier tasks.
- Type consistency: `PendingContentRoute`, storage key, parser, and `SignedInApp` props are defined once and reused consistently across tasks.
