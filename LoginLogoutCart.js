const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false }); 
    const page = await browser.newPage();
    const targetURL = 'https://www.saucedemo.com/';
    const delayDuration = 1000;
    const validUsername = "standard_user";
    const password = "secret_sauce";
    const productName = "Sauce Labs Backpack";
    const usernameField = page.locator('#user-name');
    const passwordField = page.locator('#password');
    const loginButton = page.locator('#login-button');
    const backpackAddToCartButton = page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]');
    const shoppingCartLink = page.locator('.shopping_cart_link');
    const cartItemName = page.locator('.inventory_item_name');
    const menuButton = page.locator('#react-burger-menu-btn');
    const logoutLink = page.locator('#logout_sidebar_link');

    try {
        console.log(`\n--- Starting Test: Login, Add to Cart, Verify, Logout ---`);
        await page.goto(targetURL);
        
        console.log("1. Logging in...");
        await usernameField.fill(validUsername);
        await passwordField.fill(password);

        await loginButton.click();
        await page.waitForTimeout(delayDuration);

        await page.waitForURL('**/inventory.html');
        console.log("Login successful.");

        console.log(`2. Adding product: ${productName}`);

        await backpackAddToCartButton.click();
        await page.waitForTimeout(delayDuration); // ADDED DELAY

        await page.waitForSelector('.shopping_cart_badge', { hasText: '1' });
        console.log("Product added to cart.");

        console.log("3. Navigating to cart and verifying product name...");

        await shoppingCartLink.click();
        await page.waitForTimeout(delayDuration);

        await page.waitForURL('**/cart.html');
        
        const itemInCart = await cartItemName.textContent();

        if (itemInCart.trim() === productName) {
            console.log(`Verification successful! Cart contains: "${itemInCart.trim()}".`);
        } else {
            throw new Error(`Verification failed. Expected: "${productName}", but found: "${itemInCart.trim()}"`);
        }

        console.log("4. Logging out...");
        await menuButton.click();
        await page.waitForTimeout(delayDuration);

        await logoutLink.waitFor({ state: 'visible' }); 

        await logoutLink.click();
        await page.waitForTimeout(delayDuration);

        await page.waitForURL(targetURL);
        console.log("Logout successful.");
        
        console.log("\n--- Test Completed Successfully! ---");

    } catch (error) {
        console.error("\n--- Test Failed ---");
        console.error(error.message);
        await page.screenshot({ path: 'failure_screenshot.png' });
        console.log("Screenshot taken: failure_screenshot.png");
    } finally {
        await browser.close();
    }
})();