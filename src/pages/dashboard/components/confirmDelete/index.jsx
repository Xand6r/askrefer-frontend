import { useState } from "react";
import { useHistory } from "react-router";

import Button from "@/components/button";
import "@/styles/input.scss";

import "./styles.scss";

const CTA_TEXT = "Delete Ask";


export default function Index({ onSubmit, loading }) {

  return (
    <div id="kyc-form" className="slider-form">
      <div className="header-group">
        <h1 className="slider-form__header">Delete your ask</h1>

        <h6 className="slider-form__subheader">
          Are you sure you want to delete your ask, this action cannot be reversed.
        </h6>
      </div>

      <form action="javascript:void(0)">
        <Button
          text={CTA_TEXT}
          onClick={onSubmit}
          loading={loading}
        />
      </form>
    </div>
  );
}
