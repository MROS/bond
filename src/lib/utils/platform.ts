export enum Platform {
	MacOS,
	Windows,
	Linux,
	IOS,
	Android,
	Unknown
}

export function getPlatform() {
	const userAgent = window.navigator.userAgent,
		appVersion = window.navigator.appVersion,
		macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
		windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
		iosPlatforms = ['iPhone', 'iPad', 'iPod'];

	// TODO: 雖然 navigator.platform 已經廢棄
	// 替代品 window.navigator.userAgentData.platform 仍在實驗階段
	// https://developer.mozilla.org/en-US/docs/Web/API/NavigatorUAData/platform
	const platform = window.navigator.platform;

	if (macosPlatforms.indexOf(platform) !== -1) {
		return Platform.MacOS;
	} else if (iosPlatforms.indexOf(platform) !== -1) {
		return Platform.IOS;
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		return Platform.Windows;
	} else if (/Android/.test(userAgent) || /Android/.test(appVersion)) {
		return Platform.Android;
	} else if (/Linux/.test(platform)) {
		return Platform.Linux;
	}

	return Platform.Unknown;
}
