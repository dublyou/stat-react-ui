import React, { Component } from 'react';
import ProfileHeader from '../components/profileHeader'
import ProfileTabs from '../components/profileTabs'

class Profile extends React.Component {
	render() {
		return (
			<div >
				<ProfileHeader></ProfileHeader>
				<ProfileTabs></ProfileTabs>
			</div>
		)
	}
}

export default Profile;