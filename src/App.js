import { useEffect, useState,useRef } from "react"
import * as cocoSsd from "@tensorflow-models/coco-ssd"

function App() {
  const [model,setModel]=useState(null)
  const [isModelLoad,setIsModelLoad]=useState(false)
  const [imageUrl, setImageUrl] = useState(null);
  const [results, setResults] = useState(null);

  const imageRef = useRef();

  const loadModel = async ()=>{
    setIsModelLoad(true)
    try {
      const loadedmodel= await cocoSsd.load();
      setModel(loadedmodel)
      setIsModelLoad(false)
    } catch (error) {
      console.log(error);
      setIsModelLoad(false)
    }
  }
  useEffect(()=>{
   loadModel() 
  },[])

 if(isModelLoad)
 {
   return <h1>Loading...</h1>
 }

  const uploadImage = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  };

  const objectDetect = async ()=>{
    console.log(imageUrl)
    const result = await model.detect(imageRef.current)
    console.log(result)
    setResults(results);
    
  }


  return (
    <div className="App">
     <h1>Object detection</h1>
     <div>
       <input type="file" capture="camera" accept="image/" onChange={uploadImage} />
       <div className='imageHolders'>
            {imageUrl && <img src={imageUrl} alt='upload Preview' crossOrigin='anonymous' ref={imageRef}  />}
        </div>
        <div className='mainWrapper'>
        <div className='mainContent'>
          <div className='imageHolders'>
          {results &&
            results?.map((items) => {
              return (
                <ol>
                  <li>{items.class}</li>
                  <li>{items.score}</li>
                </ol>
              );
            })}
            </div>
            </div>
            </div>
     </div>
     {imageUrl && (
          <button className='button' onClick={objectDetect}>
            Identify Image
          </button>
        )}
    
    </div>
  );
}

export default App;
