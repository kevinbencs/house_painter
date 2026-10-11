- Post /api/analytics: 

Return:
```
Code   Description
201    message: "success"
```

Error:
```
Code   Description
400    failed: string[]
500    error: string
```



- Get /api/images/id/[id]:

Return:
```
Code   Description
200    success: Img | null 
```

Img:
```
_id: string,
newUrl: string,
detail: string,
show: boolean,
blobUrl: string
```

Error:
```
Code   Description
404    error: "Nincs ilyen kép"
500    error: string
```



- Get /api/images/img:

Return:
```
Code   Description
200    success: ImageModel[]
```

ImageModel:
```
blobUrl: string,
newUrl: string,
detail: string,
show: boolean,
_id: string
```

Error:
```
Code   Description
500    error: string
```
