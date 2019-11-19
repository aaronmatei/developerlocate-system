import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaBlackTie, FaUserCircle } from 'react-icons/fa';

const ProfileActions = () => {
	return (
		<div className='btn-group mb-4' role='group'>
			<Link to='/edit-profile' className='btn btn-light'>
				<FaUserCircle size={20} className='text-info mr-1' />
				Edit Profile
			</Link>
			<Link to='/add-experience' className='btn btn-light'>
				<FaBlackTie size={20} className='text-info mr-1' />
				Add Experience
			</Link>
			<Link to='/add-education' className='btn btn-light'>
				<FaGraduationCap size={25} className='text-info mr-1' />
				Add Education
			</Link>
		</div>
	);
};
export default ProfileActions;
