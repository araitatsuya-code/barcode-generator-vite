require("dotenv").config();
const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  console.log(`公証処理を開始: ${appPath}`);

  try {
    await notarize({
      tool: "notarytool",
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword:
        process.env.APPLE_APP_SPECIFIC_PASSWORD || process.env.APPLE_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
  } catch (error) {
    console.error("公証中にエラーが発生しました:", error);
    throw error;
  }

  console.log("公証が完了しました");
};
