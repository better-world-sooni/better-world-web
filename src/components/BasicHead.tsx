import Head from 'next/head'
import React from 'react'

const BasicHead = () => {
    return (
			<Head>
				<title>BetterWorld</title>
				<meta name="description" content="Mobile Networking Service for PFPs" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
		);
}

export default BasicHead