import React from 'react';

export default function Spinner() {
	return (
		<div>
			<img
				src='https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'
				style={{ width: '200px', margin: 'auto', display: 'block' }}
				alt='Loading...'
			/>
		</div>
	);
}
