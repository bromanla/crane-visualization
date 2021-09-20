int counter = 0;

void setup() {
  Serial.begin(9600);
}

void loop() {
  Serial.print(counter);
  delay(1000);

  counter = counter > 128 ? 0 : counter + 1;
}
