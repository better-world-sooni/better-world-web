import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import Fade from 'react-reveal/Fade';
import Dashboard from "src/components/admin/dashboard";
import UserList from "src/components/admin/userlist";
import TestAdmin from "src/components/admin/test";
import { NextPageContext } from "next";
import { apiHelperWithJwtFromContext } from "src/modules/apiHelper";
import apis from "src/modules/apis";
import { useDispatch } from "react-redux";
import { userlistAction } from "src/store/reducers/adminReducer";
import Joblist from "src/components/admin/joblist";

function Admin({user_list, currentUser, currentNft}) {
	if (!currentNft?.privilege)  return (<>Invalid Access</>);
	const dispatch = useDispatch();
	dispatch(userlistAction({user_list: user_list}));
	const frame = [
		<AdminTemplete key={0} name={"Dashboard"} Comps={Dashboard}/>,
		<AdminTemplete key={1} name={"User List"} Comps={UserList}/>,
		<AdminTemplete key={2} name={"Test2"} Comps={TestAdmin}/>,
		<AdminTemplete key={3} name={"Test3"} Comps={TestAdmin}/>,
	]

	return (
		<>
			<MainTopBar currentUser={currentUser} currentNft={currentNft} />
			<Div zIndex={-1000} minH={700}>
				<Joblist frame={frame}/>
			</Div>
			<Footer />
		</>
	);
}

Admin.getInitialProps = async (ctx:NextPageContext) => {
	const res = await apiHelperWithJwtFromContext(ctx, apis.admin.user.list(50,0), 'GET')
	return {user_list:res};
};

function AdminTemplete({name, Comps}) {
	return (
		<Div wFull ml200 flex itemsCenter justifyCenter auto bgWhite>
			<Div maxW={1100} flex flexCol wFull bgWhite mb100 rounded10 py30 px20 bgOpacity90>
			<Fade>
				<Div fontSize30 textStart selfStart fontSemibold>
					{name}
				</Div>
				<Div ml10><Comps/></Div>
			</Fade>
			</Div>
		</Div>
	);
}


export default Admin;