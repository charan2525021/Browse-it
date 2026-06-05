import base64
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class BrowserService:
    async def get_screenshot(self, browser_context) -> Optional[str]:
        try:
            page = await browser_context.get_current_page()
            screenshot_bytes = await page.screenshot()
            return base64.b64encode(screenshot_bytes).decode()
        except Exception as e:
            logger.error(f"Screenshot error: {e}")
            return None
