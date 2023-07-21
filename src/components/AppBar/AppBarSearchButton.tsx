import {ReactComponent as SearchIcon} from "assets/icons/search.svg";
import {Link} from "react-router-dom";

export default function AppBarSearchButton() {
  return (
    <Link className="p-1.5" to="/books">
      <SearchIcon />
    </Link>
  );
}
