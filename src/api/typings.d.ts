declare namespace API {
  type addAudioFileUsingPOSTParams = {
    fileType?: number
    introduction?: string
    title?: string
  }

  type AddCommentDto = {
    content?: string
    fromId?: number
    parentId?: number
    targetId?: number
    targetType?: number
    targetUserId?: number
  }

  type AddFollowDto = {
    followerId?: number
    followerIdName?: string
    status?: number
    userId?: number
    userIdName?: string
  }

  type addForumFileUsingPOSTParams = {
    fileUrl?: string
    forumId?: number
    id?: number
    position?: number
    sort?: number
    type?: number
  }

  type AudioFileQueryDto = {
    current?: number
    fileType?: number
    id?: number
    introduction?: string
    pageSize?: number
    size?: number
    sortField?: string
    sortOrder?: string
    title?: string
    userId?: number
  }

  type AudioFileUpdateDto = {
    id?: number
    introduction?: string
    title?: string
  }

  type AudioFileVO = {
    createTime?: string
    fileType?: number
    fileUrl?: string
    id?: number
    introduction?: string
    md5?: string
    size?: number
    title?: string
    updateTime?: string
    userId?: number
    userVO?: UserVO
  }

  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCreateOutPaintingTaskVo_ = {
    code?: number
    data?: CreateOutPaintingTaskVo
    message?: string
  }

  type BaseResponseFollow_ = {
    code?: number
    data?: Follow
    message?: string
  }

  type BaseResponseForum_ = {
    code?: number
    data?: Forum
    message?: string
  }

  type BaseResponseForumFile_ = {
    code?: number
    data?: ForumFile
    message?: string
  }

  type BaseResponseForumVO_ = {
    code?: number
    data?: ForumVO
    message?: string
  }

  type BaseResponseGetOutPaintingTaskVo_ = {
    code?: number
    data?: GetOutPaintingTaskVo
    message?: string
  }

  type BaseResponseInt_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseListCommentVO_ = {
    code?: number
    data?: CommentVO[]
    message?: string
  }

  type BaseResponseListForumFile_ = {
    code?: number
    data?: ForumFile[]
    message?: string
  }

  type BaseResponseListImageSearchDto_ = {
    code?: number
    data?: ImageSearchDto[]
    message?: string
  }

  type BaseResponseListPictureVO_ = {
    code?: number
    data?: PictureVO[]
    message?: string
  }

  type BaseResponseListSpace_ = {
    code?: number
    data?: Space[]
    message?: string
  }

  type BaseResponseListSpaceCategoryAnalyzeVo_ = {
    code?: number
    data?: SpaceCategoryAnalyzeVo[]
    message?: string
  }

  type BaseResponseListSpaceLevel_ = {
    code?: number
    data?: SpaceLevel[]
    message?: string
  }

  type BaseResponseListSpaceSizeAnalyzeVo_ = {
    code?: number
    data?: SpaceSizeAnalyzeVo[]
    message?: string
  }

  type BaseResponseListSpaceTagAnalyzeVo_ = {
    code?: number
    data?: SpaceTagAnalyzeVo[]
    message?: string
  }

  type BaseResponseListSpaceUser_ = {
    code?: number
    data?: SpaceUser[]
    message?: string
  }

  type BaseResponseListSpaceUserAnalyzeVo_ = {
    code?: number
    data?: SpaceUserAnalyzeVo[]
    message?: string
  }

  type BaseResponseListSpaceUserVO_ = {
    code?: number
    data?: SpaceUserVO[]
    message?: string
  }

  type BaseResponseLoginUserVo_ = {
    code?: number
    data?: LoginUserVo
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageAudioFileVO_ = {
    code?: number
    data?: PageAudioFileVO_
    message?: string
  }

  type BaseResponsePageChatPromptVO_ = {
    code?: number
    data?: PageChatPromptVO_
    message?: string
  }

  type BaseResponsePageCommentVO_ = {
    code?: number
    data?: PageCommentVO_
    message?: string
  }

  type BaseResponsePageFollowVO_ = {
    code?: number
    data?: PageFollowVO_
    message?: string
  }

  type BaseResponsePageForum_ = {
    code?: number
    data?: PageForum_
    message?: string
  }

  type BaseResponsePageForumVO_ = {
    code?: number
    data?: PageForumVO_
    message?: string
  }

  type BaseResponsePageLikeMessageVO_ = {
    code?: number
    data?: PageLikeMessageVO_
    message?: string
  }

  type BaseResponsePagePicture_ = {
    code?: number
    data?: PagePicture_
    message?: string
  }

  type BaseResponsePagePictureVO_ = {
    code?: number
    data?: PagePictureVO_
    message?: string
  }

  type BaseResponsePageSpace_ = {
    code?: number
    data?: PageSpace_
    message?: string
  }

  type BaseResponsePageSpaceVO_ = {
    code?: number
    data?: PageSpaceVO_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponsePicture_ = {
    code?: number
    data?: Picture
    message?: string
  }

  type BaseResponsePictureTagCategory_ = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type BaseResponsePictureVO_ = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type BaseResponseSpace_ = {
    code?: number
    data?: Space
    message?: string
  }

  type BaseResponseSpaceUsageAnalyzeVo_ = {
    code?: number
    data?: SpaceUsageAnalyzeVo
    message?: string
  }

  type BaseResponseSpaceUser_ = {
    code?: number
    data?: SpaceUser
    message?: string
  }

  type BaseResponseSpaceVO_ = {
    code?: number
    data?: SpaceVO
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserLikeVO_ = {
    code?: number
    data?: UserLikeVO
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type ChatPromptAddDto = {
    chatType?: number
    lastMessage?: string
    lastMessageTime?: string
    receiveTitle?: string
    targetId?: number
    title?: string
    unreadCount?: number
    userId?: number
  }

  type ChatPromptQueryDto = {
    chatType?: number
    current?: number
    id?: number
    isQuery?: number
    lastMessage?: string
    lastMessageTime?: string
    pageSize?: number
    receiveTitle?: string
    sortField?: string
    sortOrder?: string
    targetId?: number
    title?: string
    unreadCount?: number
    userId?: number
  }

  type ChatPromptUpdateDto = {
    chatType?: number
    id?: number
    lastMessage?: string
    lastMessageTime?: string
    receiveTitle?: string
    targetId?: number
    title?: string
    unreadCount?: number
    userId?: number
  }

  type ChatPromptVO = {
    chatType?: number
    createTime?: string
    id?: number
    isReceive?: number
    lastMessage?: string
    lastMessageTime?: string
    receiveTitle?: string
    targetId?: number
    targetUserVO?: UserVO
    title?: string
    unreadCount?: number
    updateTime?: string
    userId?: number
  }

  type CommentQueryDto = {
    content?: string
    current?: number
    fromId?: number
    id?: number
    isCommentMy?: number
    isRead?: number
    likeCount?: number
    pageSize?: number
    parentId?: number
    sortField?: string
    sortOrder?: string
    targetId?: number
    targetType?: number
    targetUserId?: number
    userId?: number
  }

  type CommentReadDto = {
    id?: number
    isRead?: number
  }

  type CommentVO = {
    commentVOChildList?: CommentVO[]
    content?: string
    createTime?: string
    forumVO?: ForumVO
    fromId?: number
    id?: number
    isRead?: number
    likeCount?: number
    parentId?: number
    pictureVO?: PictureVO
    targetId?: number
    targetType?: number
    targetUserId?: number
    updateTime?: string
    userId?: number
    userVO?: UserVO
  }

  type CreateOutPaintingTaskVo = {
    code?: string
    message?: string
    output?: Output
    requestId?: string
  }

  type CreatePictureOutPaintingTaskDto = {
    parameters?: Parameters
    pictureId?: number
  }

  type DeleteRequest = {
    id?: number
  }

  type downloadFileUsingGETParams = {
    /** filePath */
    filePath?: string
  }

  type Follow = {
    createTime?: string
    followState?: number
    followerId?: number
    id?: number
    isDeleted?: number
    isMutual?: number
    userId?: number
  }

  type FollowQueryDto = {
    current?: number
    followState?: number
    followerId?: number
    id?: number
    isMutual?: number
    pageSize?: number
    queryStatus?: number
    sortField?: string
    sortOrder?: string
    userId?: number
  }

  type FollowVO = {
    createTime?: string
    followState?: number
    followerId?: number
    followerVO?: UserVO
    id?: number
    isMutual?: number
    userId?: number
    userVO?: UserVO
  }

  type Forum = {
    category?: string
    commentCount?: number
    content?: string
    createTime?: string
    id?: number
    isDelete?: number
    likeCount?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    shareCount?: number
    title?: string
    updateTime?: string
    userId?: number
    viewCount?: number
  }

  type ForumAddDto = {
    category?: string
    content?: string
    listForumFileId?: number[]
    title?: string
  }

  type ForumFile = {
    createTime?: string
    forumId?: number
    id?: number
    isDelete?: number
    picUrl?: string
    position?: number
    size?: number
    sort?: number
    thumbnailUrl?: string
    type?: number
    updateTime?: string
  }

  type ForumFileAddDto = {
    fileUrl?: string
    forumId?: number
    id?: number
    position?: number
    sort?: number
    type?: number
  }

  type ForumFileDeleteDto = {
    ids?: number[]
  }

  type ForumFileQueryDto = {
    forumId?: number
    id?: number
    sort?: number
    type?: number
  }

  type ForumQueryDto = {
    category?: string
    commentCount?: number
    content?: string
    current?: number
    id?: number
    likeCount?: number
    pageSize?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    shareCount?: number
    sortField?: string
    sortOrder?: string
    title?: string
    userId?: number
    viewCount?: number
  }

  type ForumReviewDto = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type ForumUpdateDto = {
    category?: string
    content?: string
    id?: number
    listForumFileId?: number[]
    title?: string
  }

  type ForumVO = {
    category?: string
    commentCount?: number
    content?: string
    createTime?: string
    forumFile?: ForumFile[]
    id?: number
    likeCount?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    shareCount?: number
    title?: string
    updateTime?: string
    userId?: number
    userVO?: UserVO
    viewCount?: number
  }

  type getFollowCountByUserUsingGETParams = {
    /** id */
    id?: number
  }

  type getForumUsingGETParams = {
    /** id */
    id?: number
  }

  type getForumVOUsingGETParams = {
    /** id */
    id?: number
  }

  type getOutPaintingTaskUsingGETParams = {
    /** taskId */
    taskId?: string
  }

  type GetOutPaintingTaskVo = {
    output?: Output1
    requestId?: string
  }

  type getPictureByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureByIdVoUsingGETParams = {
    /** id */
    id?: number
  }

  type getSpaceByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getSpaceByIdVoUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type ImageSearchDto = {
    fromUrl?: string
    thumbUrl?: string
  }

  type LikeCommentDto = {
    id?: number
    likeCount?: number
  }

  type LikeMessageAddDto = {
    actionType?: number
    receiverId?: number
    targetId?: number
    targetType?: number
  }

  type LikeMessageQueryDto = {
    actionType?: number
    current?: number
    id?: number
    isRead?: number
    pageSize?: number
    receiverId?: number
    sendId?: number
    sortField?: string
    sortOrder?: string
    targetId?: number
    targetType?: number
  }

  type LikeMessageReadDto = {
    id?: number
    isRead?: number
  }

  type LikeMessageVO = {
    actionType?: number
    createTime?: string
    forumVO?: ForumVO
    id?: number
    isRead?: number
    pictureVO?: PictureVO
    receiverId?: number
    sendId?: number
    targetId?: number
    targetType?: number
    userVO?: UserVO
  }

  type LoginUserVo = {
    createTime?: string
    editTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type Output = {
    taskId?: string
    taskStatus?: string
  }

  type Output1 = {
    code?: string
    endTime?: string
    message?: string
    outputImageUrl?: string
    scheduledTime?: string
    submitTime?: string
    taskId?: string
    taskMetrics?: TaskMetrics
    taskStatus?: string
  }

  type PageAudioFileVO_ = {
    current?: number
    pages?: number
    records?: AudioFileVO[]
    size?: number
    total?: number
  }

  type PageChatPromptVO_ = {
    current?: number
    pages?: number
    records?: ChatPromptVO[]
    size?: number
    total?: number
  }

  type PageCommentVO_ = {
    current?: number
    pages?: number
    records?: CommentVO[]
    size?: number
    total?: number
  }

  type PageFollowVO_ = {
    current?: number
    pages?: number
    records?: FollowVO[]
    size?: number
    total?: number
  }

  type PageForum_ = {
    current?: number
    pages?: number
    records?: Forum[]
    size?: number
    total?: number
  }

  type PageForumVO_ = {
    current?: number
    pages?: number
    records?: ForumVO[]
    size?: number
    total?: number
  }

  type PageLikeMessageVO_ = {
    current?: number
    pages?: number
    records?: LikeMessageVO[]
    size?: number
    total?: number
  }

  type PagePicture_ = {
    current?: number
    pages?: number
    records?: Picture[]
    size?: number
    total?: number
  }

  type PagePictureVO_ = {
    current?: number
    pages?: number
    records?: PictureVO[]
    size?: number
    total?: number
  }

  type PageSpace_ = {
    current?: number
    pages?: number
    records?: Space[]
    size?: number
    total?: number
  }

  type PageSpaceVO_ = {
    current?: number
    pages?: number
    records?: SpaceVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type Parameters = {
    addWatermark?: boolean
    angle?: number
    bestQuality?: boolean
    bottomOffset?: number
    leftOffset?: number
    limitImageSize?: boolean
    outputRatio?: string
    rightOffset?: number
    topOffset?: number
    xScale?: number
    yScale?: number
  }

  type Picture = {
    category?: string
    commentCount?: number
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    isDelete?: number
    likeCount?: number
    name?: string
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    shareCount?: number
    spaceId?: number
    tags?: string
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    userId?: number
    viewCount?: number
  }

  type PictureAiDto = {
    content?: string
    name?: string
  }

  type PictureEditByBatchDto = {
    category?: string
    nameRule?: string
    pictureIdList?: number[]
    spaceId?: number
    tags?: string[]
  }

  type PictureEditDto = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    spaceId?: number
    tags?: string[]
  }

  type PictureQueryDto = {
    category?: string
    commentCount?: number
    current?: number
    endEditTime?: string
    homeShow?: string
    id?: number
    introduction?: string
    is4K?: number
    likeCount?: number
    name?: string
    pageSize?: number
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    queryPublic?: boolean
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    searchText?: string
    shareCount?: number
    sortField?: string
    sortOrder?: string
    spaceId?: number
    startEditTime?: string
    tags?: string[]
    userId?: number
    viewCount?: number
  }

  type PictureReviewDto = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureTagCategory = {
    categoryList?: string[]
    tagList?: string[]
  }

  type PictureUpdateDto = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    spaceId?: number
    tags?: string[]
  }

  type PictureUploadByBatchDto = {
    count?: number
    namePrefix?: string
    searchText?: string
  }

  type PictureUploadDto = {
    fileUrl?: string
    id?: number
    picName?: string
    spaceId?: number
  }

  type PictureVO = {
    category?: string
    commentCount?: number
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    likeCount?: number
    name?: string
    permissionList?: string[]
    picColor?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    shareCount?: number
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
    viewCount?: number
  }

  type SearchPictureByColorDto = {
    picColor?: string
    spaceId?: number
  }

  type SearchPictureByPictureDto = {
    pictureId?: number
  }

  type Space = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    totalCount?: number
    totalSize?: number
    updateTime?: string
    userId?: number
  }

  type SpaceAddDto = {
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
  }

  type SpaceCategoryAnalyzeDto = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceCategoryAnalyzeVo = {
    category?: string
    count?: number
    totalSize?: number
  }

  type SpaceEditDto = {
    id?: number
    spaceName?: string
  }

  type SpaceLevel = {
    maxCount?: number
    maxSize?: number
    text?: string
    value?: number
  }

  type SpaceQueryDto = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    userId?: number
  }

  type SpaceRankAnalyzeDto = {
    topN?: number
  }

  type SpaceSizeAnalyzeDto = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceSizeAnalyzeVo = {
    count?: number
    sizeRange?: string
  }

  type SpaceTagAnalyzeDto = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceTagAnalyzeVo = {
    count?: number
    tag?: string
  }

  type SpaceUpdateDto = {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceUsageAnalyzeDto = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
  }

  type SpaceUsageAnalyzeVo = {
    countUsageRatio?: number
    maxCount?: number
    maxSize?: number
    sizeUsageRatio?: number
    usedCount?: number
    usedSize?: number
  }

  type SpaceUser = {
    createTime?: string
    id?: number
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    userId?: number
  }

  type SpaceUserAddDto = {
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserAnalyzeDto = {
    queryAll?: boolean
    queryPublic?: boolean
    spaceId?: number
    timeDimension?: string
    userId?: number
  }

  type SpaceUserAnalyzeVo = {
    count?: number
    period?: string
  }

  type SpaceUserEditDto = {
    id?: number
    spaceRole?: string
  }

  type SpaceUserQueryDto = {
    id?: number
    spaceId?: number
    spaceRole?: string
    userId?: number
  }

  type SpaceUserVO = {
    createTime?: string
    id?: number
    space?: SpaceVO
    spaceId?: number
    spaceRole?: string
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    permissionList?: string[]
    spaceLevel?: number
    spaceName?: string
    spaceType?: number
    totalCount?: number
    totalSize?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type TaskMetrics = {
    failed?: number
    succeeded?: number
    total?: number
  }

  type uploadPictureUsingPOSTParams = {
    fileUrl?: string
    id?: number
    picName?: string
    spaceId?: number
  }

  type User = {
    createTime?: string
    editTime?: string
    email?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddDto = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserChangePwdDto = {
    checkPassword?: string
    id?: number
    oldUserPassword?: string
    userPassword?: string
  }

  type UserEditDto = {
    id?: number
    userName?: string
    userProfile?: string
  }

  type UserEmailDto = {
    email?: string
  }

  type UserLikeAddDto = {
    likeShare?: number
    targetId?: number
    targetType?: number
  }

  type UserLikeQueryDto = {
    current?: number
    likeShare?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    targetId?: number
    targetType?: number
  }

  type UserLikeVO = {
    createTime?: string
    id?: number
    likePic?: string[]
    likePicVO?: PictureVO[]
    likePost?: string[]
    likePostVO?: ForumVO[]
    likeShare?: number
    targetType?: number
    userAvatar?: string
    userId?: number
    userName?: string
  }

  type UserLoginDto = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryDto = {
    current?: number
    email?: string
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterDto = {
    checkPassword?: string
    code?: string
    email?: string
    userPassword?: string
  }

  type UserUpdateDto = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    email?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
