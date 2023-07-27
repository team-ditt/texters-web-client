import {lazy} from "react";

const CreateBookAgreement = lazy(() => import("./CreateBookAgreement"));
const OfficialDocument = lazy(() => import("./OfficialDocument"));

export const Modal = {CreateBookAgreement, OfficialDocument};
