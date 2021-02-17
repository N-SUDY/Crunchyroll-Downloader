import React, {useEffect} from "react"
import ReactDom from "react-dom"
import TitleBar from "./components/TitleBar"
import SearchBar from "./components/SearchBar"
import LogoBar from "./components/LogoBar"
import {ipcRenderer} from "electron"
import VersionDialog from "./components/VersionDialog"
import LoginDialog from "./components/LoginDialog"
import EpisodeContainerList from "./components/EpisodeContainerList"
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.less"
import functions from "./structures/functions"

const App: React.FunctionComponent = () => {

  useEffect(() => {
    ipcRenderer.on("debug", console.log)
    window.addEventListener("mousemove", functions.autoScroll)
    return () => {
      ipcRenderer.removeListener("debug", console.log)
      window.removeEventListener("mousemove", functions.autoScroll)
    }
  }, [])

  return (
    <main className="app">
      <TitleBar/>
      <VersionDialog/>
      <LoginDialog/>
      <LogoBar/>
      <SearchBar/>
      <EpisodeContainerList/>
    </main>
  )
}

ReactDom.render(<App/>, document.getElementById("root"))
