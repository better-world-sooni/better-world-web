import { useSelector } from "react-redux";
import { RootState } from "src/store/reducers/rootReducer";

export default function useCheckPrivilege() {
  const { currentNft, currentUser } = useSelector((state: RootState) => ({
    currentNft: state.admin.currentNft.currentNft,
    currentUser: state.admin.currentNft.currentUser,
  }));
  const isPrivilege = currentNft?.privilege;
  const isSuperPrivilege = currentUser?.super_privilege;
  return { currentNft, currentUser, isPrivilege, isSuperPrivilege };
}
