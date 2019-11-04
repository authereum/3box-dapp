import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { alphabetize } from '../../utils/funcs';

import FollowingTile from '../../components/FollowingTile';
import Loading from '../../assets/Loading.svg';
import Globe from '../../assets/Globe.svg';
import './styles/Profile.css';
import './styles/Feed.css';

const Following = ({ following, isLoadingMyFollowing }) => (
  <div id="myFeed" className="contacts_page">
    <div className="header followingHeader" id="feed__header">
      <div className="followingHeader_title">
        {`Following (${following.length})`}
        <img src={Globe} alt="Public" className="favorites__publicIcon" title="Following will appear in your public profile" />
      </div>
      <div className="followingHeader_warning">
        <p className="followingHeader_warning_text">Addresses you follow are public</p>
      </div>
    </div>

    <div className="contact_list">
      {
        following.length > 0 ? alphabetize(following).map(user => (
          <FollowingTile
            user={user[0]}
            isFollowing
            address={user[1]}
          />
        )) : <EmptyContact isLoadingMyFollowing={isLoadingMyFollowing} />
      }
    </div>
  </div>
);

Following.propTypes = {
  following: PropTypes.array,
  isLoadingMyFollowing: PropTypes.bool,
};

Following.defaultProps = {
  following: [],
  isLoadingMyFollowing: false,
};

function mapState(state) {
  return {
    following: state.myData.following,

    isLoadingMyFollowing: state.uiState.isLoadingMyFollowing,
  };
}

export default withRouter(connect(mapState)(Following));

const EmptyContact = ({ isLoadingMyFollowing }) => (
  <div className="feed_activity_empty">
    {isLoadingMyFollowing ? (
      <img src={Loading} alt="loading" id="activityLoad" />
    ) : (
        <p className="feed_activity_empty_text">
          You're not following anyone yet
        </p>
      )}
  </div>
);

EmptyContact.propTypes = {
  isLoadingMyFollowing: PropTypes.bool,
};

EmptyContact.defaultProps = {
  isLoadingMyFollowing: false,
};