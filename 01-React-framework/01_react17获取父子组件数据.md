
## 父组件
```javaScript
import React, { useEffect, useRef } from 'react'
import Zoom from './zoom'

//封装的Hooks⽤用use开头
const useChangeTitle = (title) => {
  useEffect(() => {
    document.title = title
  }, [title])
}

const App = ((props) => {
  useChangeTitle("⾃自定义修改标题Hooks")

  const zoomComRef = useRef<any>(null)

  const onGetRef = () => {
    const zoomImgRef = zoomComRef.current.getZoomImg()
  }

  return (
    <>
      <div>
        测试图片放大
      </div>
      <div onClick={() => onGetRef()}>获取子组件</div>
      <div>
        <Zoom ref={zoomComRef} />
      </div>
    </>
  );
})

export default App;
```

## 子组件
```javaScript
import React, { useRef, useImperativeHandle,forwardRef } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const ZoomImg = forwardRef((props, ref) => {

	const zoomImgRef = useRef<any>('');

	useImperativeHandle(ref, () => ({
		getZoomImg: () => {
			return zoomImgRef.current
		}
	}));

	return (
		<>
			<TransformWrapper
				onZoom={function noRefCheck() {
					console.log("ref:", zoomImgRef.current)
				}}
				initialScale={0.5}
				centerOnInit={true}
				maxScale={2}
				minScale={0.5}
				doubleClick={{ step: 0.7, disabled: false, excluded: [], }}
				panning={{ disabled: false, excluded: [] }}
				wheel={{ disabled: false, step: 0.2, activationKeys: [], excluded: [], touchPadDisabled: false, }}
			>
				<TransformComponent wrapperStyle={{ background: "rgba(0, 0, 0, 0.3)", maxWidth: '80vw', maxHeight: '80vh' }}>
					<img ref={zoomImgRef} src="https://prc5.github.io/react-zoom-pan-pinch/static/media/medium-image.12ec4e94.jpg" alt="test" />
				</TransformComponent>
			</TransformWrapper>
		</>
	);
})
export default ZoomImg;
```
