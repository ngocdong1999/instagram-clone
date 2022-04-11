import { useContext,useState } from 'react'
import { stringAvatar } from "../../utils/setMui";

import { Link } from 'react-router-dom';
import { PostContext } from '../../contexts/PostContext';
import { AuthContext } from '../../contexts/AuthContext';

import { Avatar, Card, CardHeader, IconButton, CardMedia, CardContent, Typography, CardActions,Menu, MenuItem, ListItemIcon } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import * as moment from 'moment';
import 'moment/locale/vi';

export default function SinglePost({post, countLike, liked, onHandleLikePost}) {
  const {setShowUpdatePostModal, findPost, deletePost, setShowToast} = useContext(PostContext)
  const {authState} = useContext(AuthContext)

  const handleShowUpdatePost = (id) => {
    findPost(id)
    setShowUpdatePostModal(true)
    handleClose()
  }
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDeletePost = async (id) => {
    const { message, success } = await deletePost(id);
    setShowToast({show: true, message, type: success});
    handleClose()
  }
  const handleLikePost = (id,liked) => {
    onHandleLikePost(id,liked)
  }
  return (
    <Card className="mt-5 border border-solid border-[#dbdbdb] !shadow-none" sx={{maxWidth: 614}}>
      <CardHeader 
        avatar={<Link to={`/${post.user.username}`}>
          {post.user.image 
            ? <Avatar alt={post.user.firstname+' '+post.user.lastname} src={post.user.image} sx={{height:32,width:32}}/> 
            : <Avatar {...stringAvatar(post.user.firstname+' '+post.user.lastname)} sx={{height:32,width:32, fontSize: 16}}/>}
        </Link>
        } 
        action={<IconButton aria-label="settings" onClick={handleClick}>
                  <MoreHorizIcon />
                </IconButton>} 
        title= {<Link to={`/${post.user.username}`}>{post.user.firstname+' '+post.user.lastname}</Link>}
        titleTypographyProps={{
          fontSize: 14,
          lineHeight: '18px',
          color: '#262626',
          fontWeight: 600,
          textOverflow: 'ellipsis'
        }}
        subheader={
          moment.utc(post.createAt).local().fromNow()
        }
        subheaderTypographyProps={{
          fontSize: 12,
          lineHeight:'16px',
          fontWeight:400,
          color: '#8e8e8e',
          textOverflow: 'ellipsis'
        }}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
          authState.user._id === post.user._id && <MenuItem onClick={handleShowUpdatePost.bind(this,post._id)}><ListItemIcon><EditOutlinedIcon /></ListItemIcon>Sửa</MenuItem>
        }
        {
          authState.user._id === post.user._id &&<MenuItem onClick={handleDeletePost.bind(this,post._id)}><ListItemIcon><DeleteOutlineOutlinedIcon /></ListItemIcon>Xóa</MenuItem>
        }
        {
          authState.user._id !== post.user._id && <MenuItem onClick={handleClose} disabled><ListItemIcon><ReportProblemOutlinedIcon /></ListItemIcon>Báo cáo (Develop)</MenuItem>
        }
        
      </Menu>
      <CardMedia
        component="img"
        image={post.image}
        alt={post.title}
      />
      <CardActions disableSpacing sx={{paddingBottom: 0}}>
        <IconButton aria-label="add to favorites" onClick={() => handleLikePost(post._id, liked)}>
          { !liked ? <FavoriteBorderOutlinedIcon fontSize='medium' /> : <FavoriteIcon sx={{color: '#ed4956'}}></FavoriteIcon>}
        </IconButton>
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        {/* <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
      </CardActions>
      <CardContent className='!pb-2 !pt-0 !px-4'>
        <Typography variant="body2" className='!text-[#262626] !font-sm !font-semibold !text-sm !leading-[18px] !mb-2'>
          {countLike !== 0 ? `${countLike.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} lượt thích` : ''} 
        </Typography>
        <Typography variant="body2" className='!text-[#262626] !font-normal !text-sm !leading-[18px]'>
          {post.title}
        </Typography>
      </CardContent>
    </Card>
  )
}