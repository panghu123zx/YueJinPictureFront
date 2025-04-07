declare namespace API {
  type AddCommentDto = {
    content?: string
    fromId?: number
    fromName?: string
    parentId?: number
    targetId?: number
    targetType?: number
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

  type BaseResponsePageCommentVO_ = {
    code?: number
    data?: PageCommentVO_
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

  type CommentQueryDto = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    targetId?: number
    targetType?: number
  }

  type CommentVO = {
    commentVOChildList?: CommentVO[]
    content?: string
    createTime?: string
    fromId?: number
    fromName?: string
    id?: number
    likeCount?: number
    parentId?: number
    targetId?: number
    targetType?: number
    updateTime?: string
    userAvatar?: string
    userId?: number
    userName?: string
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

  type PageCommentVO_ = {
    current?: number
    pages?: number
    records?: CommentVO[]
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

  type PageRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
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
    id?: number
    introduction?: string
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
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  type UserLikeAddDto = {
    likeShare?: number
    targetId?: number
    targetType?: number
  }

  type UserLikeVO = {
    createTime?: string
    id?: number
    likePic?: PictureVO[]
    likePost?: string[]
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
    userAccount?: string
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
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
