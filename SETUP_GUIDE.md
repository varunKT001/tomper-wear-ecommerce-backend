# 📃 SETUP GUIDE

## ❗ System Requirements

- [Git](https://git-scm.com/downloads): Version control system.

- [Node.js](https://nodejs.org/en/): JavaScript runtime built on Chrome's V8 JavaScript engine (Please go with any latest LTS versions)

- [Visual Studio Code](https://code.visualstudio.com/) (or any other code editor).

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): helps you to format your JavaScript / TypeScript / CSS using [Prettier](https://github.com/prettier/prettier).

## 📝 Additional Requirements

- [Cloudinary](https://cloudinary.com/home-92022): The project uses cloudinary to store user profile and product images. I recommend you creating a cloudinary account (if you don't have on already) and use your own configuration settings.

- [Stripe](https://stripe.com/en-in) (optional): The project uses stripe as a payment-gateway. If you already have an account, it's awesome. You'll only need this if you are working on both frontend and backend.

## 🛠 Local Installation and Setup

1. Clone the repo to your local machine.
2. Install the required dependency for server using :

   ```javascript
   npm install
   ```

3. Create a `.env` file and copy-paste the contents of `.env.sample` in it and filling in the configuration keys.

4. Start the dev server using :

   ```javascript
   npm start
   ```
