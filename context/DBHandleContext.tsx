import React,{createContext,useContext,useCallback,useState} from "react";
import supabase from "@/utils/supabase";
import { NodeData } from "@/types/node_types";
import { useNode } from "./NodeContext";