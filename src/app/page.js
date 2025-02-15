'use client';

import { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';

import Head from 'next/head';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Button from '@/components/Button';

import styles from '@/styles/Home.module.scss';

const Home = () => {
  const cameraWidth = 720;
  const cameraHeight = 720;
  const aspectRatio = cameraWidth / cameraHeight;
  
  const webcamRef = useRef(null);

  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [image, setImage] = useState();
  const [cldData, setCldData] = useState();

  const videoConstraints = {
    width: {
      min: cameraWidth
    },
    height: {
      min: cameraHeight
    },
    aspectRatio
  };

  function handleCaptureScreenshot() {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    } else {
      console.warn("Webcam is not ready yet")
    }
  }

  useEffect(() => {
    if (!image) return;

    (async function run() {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          image
        })
      }).then(r => r.json());
      console.log('response', response);

      setCldData(response);
    })();
  }, [image])

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className={styles.camera}>

          <div className={styles.stageContainer}>
            <div className={styles.stage}>
              {image && (
                <img src={cldData?.secure_url || image} />
              )}
              {!image && (
                <Webcam
                  ref = {webcamRef} 
                  videoConstraints={videoConstraints} 
                  width={cameraWidth} 
                  height={cameraHeight} 
                  onUserMedia={() => setIsWebcamReady(true)}
                />
              )}
            </div>
          </div>

          <div className={styles.controls}>
            <ul>
              <li>
                <Button onClick={handleCaptureScreenshot}>
                  Capture photo
                </Button>
              </li>
              <li>
                <Button onClick={() => setImage(undefined)} color="red">
                  Reset
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.effects}>
          <h2>Filters</h2>
          <ul className={styles.filters}>
            <li data-is-active-filter={false}>
              <button className={styles.filterThumb}>
                <img width="100" height="100" src="/images/mountain-100x100.jpg" alt="Filter Name" />
                <span>Filter Name</span>
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </Layout>
  )
}

export default Home;