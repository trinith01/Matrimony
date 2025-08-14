import { useState, useEffect } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";

export function MatchMakerDialog({
  receiverId,
  requesterId,
  requestId,
  setRefetch,
}) {
  const [receiver, setReceiver] = useState(null);
  const [requester, setRequester] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const getHoroscopeDetails = async (id) => {
      console.log("Fetching horoscope details for ID:", id);
      try {
        const res = await api.get(`/horoscope/user/${id}`);
        return res.data;
      } catch (err) {
        console.error("Error fetching horoscope details", err);
        return null;
      }
    };

    const fetchData = async () => {
      const receiverData = await getHoroscopeDetails(receiverId);
      const requesterData = await getHoroscopeDetails(requesterId);
      setReceiver(receiverData);
      setRequester(requesterData);
    };

    fetchData();
  }, [receiverId, requestId]);

  const attributes = [
    "sunSign",
    "moonSign",
    "risingSign",
    "planetaryPlacements",
    "houses",
    "aspects",
    "lunarNodes",
    "chironAsteroids",
    "transits",
    "progressions",
    "solarLunarReturns",
    "eclipses",
    "elementalAnalysis",
    "planetaryDignities",
    "venusMars",
    "saturnReturn",
    "astrologicalTiming",
    "vimshottariDasha",
    "arudhaLagna",
    "status",
  ];
  const saveMatch = async (id) => {
    console.log("Saving match with ID:", id);
    console.log("score", score);
    try {
      const res = await api.put(`/horoscopeRequest/${id}`, {
        status: "reviewed",
        matchingScore: score,
      });
      console.log(res);
      setRefetch((prev) => !prev);
    } catch (err) {
      console.error("Error saving match", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Compare Horoscopes</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl  max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Matchmaker Analysis</DialogTitle>
          <DialogDescription>
            Review the astrological data of the requester and receiver.
          </DialogDescription>
        </DialogHeader>

        {requester && receiver ? (
          <div className="overflow-x-auto border rounded-lg p-4 bg-white shadow-md overflow-y-auto">
            <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
              <span>Attribute</span>
              <span>Requester: {requester.userId?.name}</span>
              <span>Receiver: {receiver.userId?.name}</span>
            </div>

            {attributes.map((attr, index) => (
              <div
                key={index}
                className="grid grid-cols-3 py-1 border-b text-sm"
              >
                <span className="capitalize">
                  {attr.replace(/([A-Z])/g, " $1")}
                </span>
                <span>{requester[attr] || "N/A"}</span>
                <span>{receiver[attr] || "N/A"}</span>
              </div>
            ))}

            {/* Navamsa Chart Image Preview */}
            <div className="grid grid-cols-3 py-3 border-b">
              <span className="font-medium">Navamsa Chart</span>
              <span>
                {requester.navamsaChart ? (
                  <img
                    src={requester.navamsaChart}
                    alt="Requester Navamsa"
                    className="w-32 h-auto border rounded"
                  />
                ) : (
                  "N/A"
                )}
              </span>
              <span>
                {receiver.navamsaChart ? (
                  <img
                    src={receiver.navamsaChart}
                    alt="Receiver Navamsa"
                    className="w-32 h-auto border rounded"
                  />
                ) : (
                  "N/A"
                )}
              </span>
            </div>

            {/* PDF Download/Preview */}
            <div className="grid grid-cols-3 pt-3">
              <span className="font-medium">Horoscope PDF</span>
              <span>
                {requester.horoscopePDF ? (
                  <a
                    href={requester.horoscopePDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                ) : (
                  "N/A"
                )}
              </span>
              <span>
                {receiver.horoscopePDF ? (
                  <a
                    href={receiver.horoscopePDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View PDF
                  </a>
                ) : (
                  "N/A"
                )}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-6">
            Loading horoscope data...
          </div>
        )}

        <DialogFooter className="mt-6">
          <div className="grid grid-cols-3 py-3 border-b">
            <span className="font-medium">Score</span>
            <Input
              type="number"
              value={score}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 0 && value <= 100) {
                  setScore(value);
                } else {
                  alert("Please enter a value between 0 and 100");
                }
              }}
            />
          </div>
          <Button
            type="submit"
            onClick={() => {
              saveMatch(requestId);
            }}
          >
            Save Match
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
