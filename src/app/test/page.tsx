"use client";
import React, { useState } from "react";
import { testFunction } from "@/lib/testLib";
import { testUtils } from "@/app/utils/testUtils";
import TestComponent from "@/components/TestComponent";

export default function Test() {
  const [apiData, setApiData] = useState("im empty rn");

  const fetchData = async () => {
    const response = await fetch("/api/testAPI");
    const data = await response.json();
    setApiData(data);
  };

  return (
    <div className="container">
      <h1>This is the Test page</h1>
      <p>WOOOO Its working baby</p>
      <button className="btn btn-primary">DaisyUI works?</button>

      <p>TestComponent:</p>
      <TestComponent />
      <p>{testFunction()}</p>
      <p>{testUtils.testFunction()}</p>
      <button className="btn btn-error btn-square btn-lg" onClick={fetchData}>
        Test API
      </button>
      <p>{`Api Data: ${JSON.stringify(apiData, null, 2)}`}</p>
    </div>
  );
}
