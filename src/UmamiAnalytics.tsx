// src/UmamiAnalytics.tsx

import Script from "next/script";
import React from "react";

interface UmamiAnalyticsProps {
	websiteId?: string;
	src?: string;
}

export const UmamiAnalytics = ({ websiteId, src }: UmamiAnalyticsProps) => {
	const finalWebsiteId = websiteId ?? process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
	const finalSrc = src ?? "https://umami.marjala.com/script.js";

	if (!finalWebsiteId) {
		console.warn("UmamiAnalytics: No websiteId provided.");
		return null;
	}

	return (
		<Script
			strategy="afterInteractive"
			src={finalSrc}
			data-website-id={finalWebsiteId}
		/>
	);
};
