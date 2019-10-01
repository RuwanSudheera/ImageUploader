import React, {Component} from 'react';
import {storage} from "../firebase";

class ImageUploader extends Component {
    state = {
            age: '',
            image: null,
            url: '',
            progress: 0
        // this.handleChange = this.handleChange.bind(this);
        // this.handleUpload = this.handleUpload.bind(this);
    };
    handleChange = e => {
        if(e.target.files[0]){
            this.setState({image: e.target.files[0]});
        }
    };
    handleUpload = () => {
        const {image} = this.state;
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed',
            (snapshot) => {
                //progress function..
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                this.setState({progress});
            },
            (error) => {
                //error function
                console.log(error);
            },
            () => {
                //complete function
                storage.ref('images').child(image.name).getDownloadURL().then(url => {
                    console.log(url);
                    this.setState({url});
                })
            })
    };

    // eslint-disable-next-line react/require-render-return
    render() {
        const style = {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        };
        return (
            <div style={style}>
                <input type="text" id="age"/>
                <progress value={this.state.progress} max="100"/>
                <br/>
                <input type="file" onChange={this.handleChange}/>
                <button onClick={this.handleUpload}>Upload</button>
                <br/>
                <img src={this.state.url || "https://via.placeholder.com/400x300"} alt="Uploaded images" height="300" width="400"/>
            </div>
        )
    }
}

export default ImageUploader;
