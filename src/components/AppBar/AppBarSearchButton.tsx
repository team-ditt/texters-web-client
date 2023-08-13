import {ReactComponent as SearchIcon} from "assets/icons/search.svg";
import {Link} from "react-router-dom";

export default function AppBarSearchButton() {
  return (
    <Link className="p-1.5 tooltip" to="/books">
      <SearchIcon />
      <span className="tooltip-text !w-[60px] !-left-[12px]">작품 검색</span>
    </Link>
  );
}
