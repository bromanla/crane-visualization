void setup() {
  Serial.begin(9600);
}

void loop() {
  byte test[] = {
    map(random(0, 128), 0, 1024, 0, 180),
    map(random(0, 128), 0, 1024, 0, 180),
    map(random(0, 128), 0, 1024, 0, 180),
  };

  broadcast(test, sizeof(test));
}

// формирование сообщения и передача по COM порту
void broadcast (byte *req, byte reqSize) {
  static unsigned long timer = millis();

  if (millis() - timer <= 200)
    return;

  timer = millis();
  char res[] = "";

  // sizeof Byte array = lenght array
  for (byte i = 0; i < reqSize; i++) {
    itoa(req[i], strchr(res, NULL), DEC);
    strcat(res, i == reqSize - 1 ? ";" : ",");
  }

  Serial.print(res);
}
