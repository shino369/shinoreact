// import { useCallback, useEffect, useState } from 'react';

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setActiveRoute } from "store/activeRoute";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "app/hooks/firebase";
import { RootState } from "store";
import moment from "moment";
import { Table } from "reactstrap";

export const DetailPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((rootState: RootState) => rootState.auth);
  const [data, setData] = useState<any[]>([]);
  const [category, setCategory] = useState<string>("entertainment");

  useEffect(() => {
    dispatch(setActiveRoute("posts"));
  }, [dispatch]);

  const getFeeds = useCallback(async () => {
    let _data: any[] = [];
    const q = query(
      collection(db, "feeds"),
      where("category", "==", `${category}`)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      // get subcollection
      const subcollection = query(
        collection(doc.ref, "posts"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      const subcollectionSnapshot = await getDocs(subcollection);
      subcollectionSnapshot.forEach((subdoc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(subdoc.id, " => ", subdoc.data());
        _data.push({
          id: subdoc.id,
          ...subdoc.data(),
          updatedAt: moment(subdoc.data().updatedAt.toDate()).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          createdAt: moment(subdoc.data().createdAt.toDate()).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        });
      });
      setData(_data);
      console.log(_data);
    });
  }, [category]);

  useEffect(() => {
    getFeeds();
  }, [getFeeds]);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-4">
      <div>Posts</div>
      {/* <button
        onClick={() => {
          getFeeds();
        }}
      >
        test
      </button> */}
      <div className="w-100 px-4">
        <select
          className="mb-2"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="entertainment">entertainment</option>
        </select>
        <div className="w-100 border rounded">
          <Table borderless hover>
            <thead>
              <tr>
                <th>user</th>
                <th>post</th>
                <th>last update</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.author}</td>
                  <td>{item.title}</td>
                  <td>{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Link to="/">go back to home</Link>
    </div>
  );
};
