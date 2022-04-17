import { createCable } from '@anycable/web'
const URL = 'ws://localhost:8080/cable';

function getWebSocketURL(jwt) {
	return `ws://localhost:8080/cable?token=${jwt}`
}

export const cable = (jwt) => createCable(getWebSocketURL(jwt))