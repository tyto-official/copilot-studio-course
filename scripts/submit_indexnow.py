"""Notify IndexNow after the latest GitHub Pages version is publicly available."""

from __future__ import annotations

import argparse
import json
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen


HOST = "tyto-official.github.io"
SITE_ROOT = f"https://{HOST}/copilot-studio-course/"
INDEXNOW_KEY = "cb458d670bb7460ba6e78872fa536b1f"
KEY_LOCATION = f"{SITE_ROOT}{INDEXNOW_KEY}.txt"
INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
URLS = [f"{SITE_ROOT}lyserno/"]


def wait_for_deployment(commit_sha: str, timeout_seconds: int = 180) -> None:
    """Wait until GitHub Pages serves the deployment marker for this commit."""
    deadline = time.monotonic() + timeout_seconds
    marker_url = f"{SITE_ROOT}deployment-version.txt"

    while time.monotonic() < deadline:
        cache_buster = urlencode({"v": int(time.time())})
        request = Request(
            f"{marker_url}?{cache_buster}",
            headers={"Cache-Control": "no-cache", "User-Agent": "Lyserno-IndexNow/1.0"},
        )
        try:
            with urlopen(request, timeout=15) as response:
                deployed_sha = response.read().decode("utf-8").strip()
                if deployed_sha == commit_sha:
                    print(f"Deployment {commit_sha[:7]} is live.")
                    return
        except (HTTPError, URLError, TimeoutError):
            pass

        time.sleep(5)

    raise TimeoutError(
        f"GitHub Pages did not expose deployment {commit_sha[:7]} within "
        f"{timeout_seconds} seconds."
    )


def submit_urls() -> None:
    """Submit Lyserno's changed public URL to IndexNow."""
    payload = json.dumps(
        {
            "host": HOST,
            "key": INDEXNOW_KEY,
            "keyLocation": KEY_LOCATION,
            "urlList": URLS,
        }
    ).encode("utf-8")
    request = Request(
        INDEXNOW_ENDPOINT,
        data=payload,
        method="POST",
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Lyserno-IndexNow/1.0",
        },
    )

    try:
        with urlopen(request, timeout=30) as response:
            status = response.status
    except HTTPError as error:
        body = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"IndexNow returned HTTP {error.code}: {body}") from error

    if status not in {200, 202}:
        raise RuntimeError(f"IndexNow returned unexpected HTTP {status}.")

    print(f"IndexNow accepted {len(URLS)} URL(s) with HTTP {status}.")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--wait-for-deployment",
        metavar="COMMIT_SHA",
        help="Wait for the public deployment marker before submitting URLs.",
    )
    args = parser.parse_args()

    if args.wait_for_deployment:
        wait_for_deployment(args.wait_for_deployment)
    submit_urls()


if __name__ == "__main__":
    main()
