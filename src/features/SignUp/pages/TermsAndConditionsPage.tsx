import {usePreventDirectSignUp} from "@/features/SignUp/hooks";
import {Link, useSearchParams} from "react-router-dom";

export default function TermsAndConditionsPage() {
  const [searchParams] = useSearchParams();

  usePreventDirectSignUp();

  return (
    <div className="mobile-view">
      약관 동의하시겠습니까?
      <Link
        className="px-4 py-2 bg-blue-primary text-white rounded-md self-center"
        to={{pathname: "/sign-up/pen-name", search: searchParams.toString()}}>
        다음
      </Link>
    </div>
  );
}
