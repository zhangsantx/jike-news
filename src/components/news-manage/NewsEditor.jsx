import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './NewsEditor.scss'

// 富文本编辑器
export default function NewsEditor(props) {
  const [editorState, setEditorState] = useState('') // 编辑器内容

  useEffect(() => {
    // 清空内容
    if (props.isClear === true) setEditorState('')
  }, [props.isClear])

  useEffect(() => {
    // 初始化设置内容
    // 将html转为富文本对象
    if (props.content) {
      const contentBlock = htmlToDraft(props.content)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        // 设置内容
        setEditorState(editorState)
      }
    }
  }, [props.content])

  return (
    <div className="news-editor-warp">
      {/* 编辑器样式类名 */}
      {/* toolbarClassName="" 工具栏区域 */}
      {/* wrapperClassName="" 编辑器整体区域 */}
      {/* editorClassName="" 内容区域 */}
      <Editor
        editorState={editorState}
        toolbarClassName="editor-toolbar"
        wrapperClassName="editor-wrapper"
        editorClassName="editor-content"
        // 设置语言为中文
        localization={{
          locale: 'zh'
        }}
        onEditorStateChange={(editorState) => {
          setEditorState(editorState)
        }}
        // 失去焦点时将数据传递给调用的父组件
        onBlur={() => {
          // draftToHtml(convertToRaw(editorState.getCurrentContent())) 将输入的内容转换成富文本
          // 将数据传递给调用父组件
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </div>
  )
}
