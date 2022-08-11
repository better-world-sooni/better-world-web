import Div from "src/components/Div";
import MainTopBar from "src/components/MainTopBar";
import Footer from "src/components/Footer";
import Fade from 'react-reveal/Fade';
import Dashboard from "src/components/admin/dashboard";
import UserList from "src/components/admin/userlist";
import TestAdmin from "src/components/admin/test";
import { NextPageContext } from "next";
import { useDispatch } from "react-redux";
import { currentNftAction } from "src/store/reducers/adminReducer";
import Joblist from "src/components/admin/joblist";
import { dehydrate } from 'react-query';
import { InitialgetUserListQuery } from 'src/hooks/queries/admin/userlist'

function Admin({currentUser, currentNft}) {
	const dispatch = useDispatch();
	if (!currentNft?.privilege)  return (<>Invalid Access</>);
    
    dispatch(currentNftAction({currentNft: currentNft}));
	const frame = [
		<AdminTemplete key={0} name={"Dashboard"} Comps={Dashboard}/>,
		<AdminTemplete key={1} name={"User List"} Comps={UserList}/>,
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

Admin.getInitialProps = async (ctx:NextPageContext, queryClient) => {
	await InitialgetUserListQuery(queryClient, ctx)
	return {dehydratedState: dehydrate(queryClient)};
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