import React from 'react';
import ProfileHeader from '../components/profileHeader'
import ProfileTabs from '../components/profileTabs'

class Profile extends React.Component {
	render() {
		const { header, tabs } = this.props;
		return (
			<div >
				<ProfileHeader {...header}></ProfileHeader>
				<ProfileTabs tabs={tabs}></ProfileTabs>
			</div>
		)
	}
}

export default Profile;