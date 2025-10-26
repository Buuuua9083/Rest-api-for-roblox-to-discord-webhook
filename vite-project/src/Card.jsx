import profilePic from './assets/profilePic.png';

function Card() {
    return (
        <div className="card">
            <img className="card-image" src={profilePic} alt="profile picture"></img>
            <h2 className="card-title">Buuuua</h2>
            <p className="card-text">I play cs2</p>
        </div>
    );
}

export default Card;