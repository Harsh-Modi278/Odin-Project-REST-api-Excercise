import React, { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")).token
    : "";

  useEffect(() => {
    // for useEffect cleanup
    const abortCont = new AbortController();
    const bearer = 'BEARER ' + token;
    // console.log({ token });
    setTimeout(() => {
      //
      
      const myInit = {
        method: 'GET',
        // withCredentials: true,
        // credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': bearer,
        },
        mode: 'cors',
        cache: "default",
        signal: abortCont.signal,
      };
      // console.log(myInit);
      fetch(url, myInit)
        .then((res) => {
          // console.log(res);
          if (!res.ok) {
            throw Error("Could not fetch data for that resource");
          }
          return res.json();
        })
        .then((jsonRes) => {
          setIsPending(false);
          setData(jsonRes);
          setError(null);
        })
        .catch((err) => {
          // we want to recognize abort error caused by switching page while data was being fetched
          // code: 20, name: "AbortError"
          if (err.code === 20) {
            console.log("fetch aborted");
          } else {
            setError(err.message);
            setIsPending(false);
          }
        });
      //
    }, 1000);

    return () => {
      // cleanup function: read more about it in documentation
      abortCont.abort();
    };
  }, [url]);

  //   whenever the url changes, the useEffect gets executed

  return {
    data: data,
    isPending: isPending,
    error: error,
  };
};

export default useFetch;

//
