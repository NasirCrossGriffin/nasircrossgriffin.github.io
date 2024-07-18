//STEP 6 - import useState to manage DOM updates
//STEP 7 - doing someting on a statechange we will import useEffect
import React, { useRef, useState, useEffect } from 'react';

//import our CSS styling
import './ImageUpload.css';

//STEP 2
import Button from './Button';

//STEP 1
//lets accept PROPS from outside and later return some JSX
const ImageUpload = props => {

    //STEP 7 - we will have a file we want to manage
    //NOTE 3 states we are managing
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const [isValid, setIsValid] = useState(false);


    //STEP 4 - to store a value establishes a connect to DOM element
    //this will allow us to simulate the File Picker
    const filePickerRef = useRef();

    //STEP 9 - this function should execute whenever the file changes
    //whenever we pick a new file we want to run this function
    useEffect(() => {
        if(!file) {
            //if we do not have a file we cannot generate a preview
            return; 
        }
        //STEP 10 - we know we have a file and can generate an image preview URL
        //with an API that is built into the browser
        //this is called the FILE READER
        //the File Reader helps us read files and parse files
        //we can use to convert file (binary data) into a readable image url
        const fileReader = new FileReader();
        //this will execute as soon as reading of file is complete
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };

        //this does not have a callback
        fileReader.readAsDataURL(file);
    },[file]);



    //STEP 5 - implement onchange handler after user chooses a file
    const pickedHandler = event => {

        //the goal is to generate something that helps us to preview that file
        //This would be the FILE input 
        //console.log(event.target);

        //STEP 7 - this files property if native File Picker
        //to ensure this does not get fired wihtout user picking a file
        //we have files and exactly 1 file
        let pickedFile;
        let fileIsValid = isValid; //current state of isValid
        if(event.target.files && event.target.files.length === 1)
        {
            //extract the picked file
            pickedFile = event.target.files[0];

            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
            
        }
        else {
            setIsValid(false);
            fileIsValid = false;
        }

        //we will forward the ID and the pickedFile if it exists
        props.onInput(props.id, pickedFile, fileIsValid);

    };

    //STEP 3 - this should be trigger when we click the button
    const pickImageHandler = () => {

        //this exists on this DOM node and will open up the picker
        filePickerRef.current.click();
    
    };


    //STEP 10 - lets use our Preview URL 
    //on the image we can out preview URL only if image is available
    return (
        //NOTE: we can use form-control class is provided in INPUT.css
        //note that ALL classes are generally are available globally in the application
        //we can use form-control also in the image upload component
        //NOTE: file is a builtin type on the INPUT
        //NOTE: accept is a default attribute you can add on inputs of type="file"
        //NOTE: onchanged fires as soon as User chooses a file
        <div className='form-control'>
            <input 
                type="file"
                ref={filePickerRef} 
                id={props.id} 
                style={{display:'none'}} 
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
                />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {previewUrl && <img src={previewUrl} alt='Preview'/>}
                    {!previewUrl && <p>Please choose an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>Choose Image</Button>
            </div>
            {!isValid && <p>Error has occured!</p>}
        </div>
    )

};

//export so we can use from other files
export default ImageUpload;