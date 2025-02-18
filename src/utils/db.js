import React from 'react'

export const saveQuizAttempt = (attempt) => {
    const request = indexedDB.open("QuizDB", 1);
  
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("attempts")) {
        db.createObjectStore("attempts", { keyPath: "id", autoIncrement: true });
      }
    };
  
    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction("attempts", "readwrite");
      const store = transaction.objectStore("attempts");
      store.add(attempt);
    };
  };
  
  export const getQuizAttempts = () => {
    return new Promise((resolve) => {
      const request = indexedDB.open("QuizDB", 1);
  
      request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("attempts", "readonly");
        const store = transaction.objectStore("attempts");
        const allAttempts = store.getAll();
  
        allAttempts.onsuccess = function () {
          resolve(allAttempts.result);
        };
      };
    });
  };
  