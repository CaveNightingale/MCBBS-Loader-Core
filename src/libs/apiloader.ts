import AInfo from "../api/AInfo";
import AStorage from "../api/AStorage";
import AjQuery from "../api/AjQuery";
import AManager from "../api/AManager";
import AUtil from "../api/AUtil";
import ADown from "../api/ADown";
import ADep from "../api/ADep";
function loadAll() {
  AInfo.load();
  AStorage.load();
  AjQuery.load();
  AManager.load();
  AUtil.load();
  ADown.load();
  ADep.load();
}
export default { loadAll };
